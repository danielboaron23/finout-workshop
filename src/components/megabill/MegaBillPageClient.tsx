"use client";

/*
 * MegaBill — client container that owns the entire interactive view state and
 * derives every visual from it:
 *   demo store  "megabill-mode"        → Cost | Usage (survives navigation)
 *   demo store  "megabill-saved-views" → named MegaBillViewState snapshots
 *   local state (rest of MegaBillViewState) → slice/aggregation/filters/
 *   legend visibility/group-by/x-axis pivot/amortized factor/chart type/
 *   table funnels + sort.
 * computeChartView + computeTableRows (megabill-data.ts) are the pure data
 * pipeline; the presentational components below receive only derived props.
 */

import { useState } from "react";
import { setDemo, useDemoStore } from "@/lib/demo-store";
import { showToast } from "@/components/ui/Toast";
import { MegaBillTopBar } from "./MegaBillTopBar";
import { MegaBillToolbar } from "./MegaBillToolbar";
import { CHART_SERIES, MegaBillChartSection } from "./MegaBillChart";
import {
  DEFAULT_DATE_HEADERS,
  DEFAULT_MEGABILL_ROWS,
  MegaBillActionsRow,
  MegaBillTable,
} from "./MegaBillTable";
import { copyText, downloadCsvFile } from "./megabill-actions";
import {
  computeChartView,
  computeTableRows,
  DEFAULT_VIEW_STATE,
  GROUP_BY_OPTIONS,
  kpiMetrics,
  rowsToCsv,
  serializeViewState,
  toggleColumnFilter,
  toggleInList,
  type MegaBillGroupBy,
  type MegaBillMode,
  type MegaBillSavedView,
  type MegaBillViewState,
} from "./megabill-data";

type RestState = Omit<MegaBillViewState, "mode">;

function stripMode(state: MegaBillViewState): RestState {
  const { mode: _mode, ...rest } = state;
  return rest;
}

export function MegaBillPageClient() {
  const mode = useDemoStore<MegaBillMode>("megabill-mode", "cost");
  const savedViews = useDemoStore<MegaBillSavedView[]>("megabill-saved-views", []);
  const [rest, setRest] = useState<RestState>(() => stripMode(DEFAULT_VIEW_STATE));
  const [viewsLabel, setViewsLabel] = useState("Views");

  const state: MegaBillViewState = { ...rest, mode };
  const patch = (p: Partial<MegaBillViewState>) => {
    const { mode: nextMode, ...others } = p;
    if (nextMode !== undefined) setDemo("megabill-mode", nextMode);
    if (Object.keys(others).length > 0) setRest((prev) => ({ ...prev, ...others }));
  };
  const applyState = (s: MegaBillViewState) => {
    setDemo("megabill-mode", s.mode);
    setRest(stripMode(s));
  };

  const dirty = serializeViewState(state) !== serializeViewState(DEFAULT_VIEW_STATE);

  /* Derived chart + table data (pure pipeline). */
  const chart = computeChartView(state);
  const { seriesFiltered, visible } = computeTableRows(DEFAULT_MEGABILL_ROWS, state);

  /* Real actions on the current table rows. */
  const exportCsv = () => downloadCsvFile(rowsToCsv(visible, DEFAULT_DATE_HEADERS));
  const copyData = () =>
    copyText(JSON.stringify(visible, null, 2)).then(
      () => showToast("Data copied to clipboard"),
      () => showToast("Copy failed"),
    );

  /* Saved views. */
  const handleSave = () => {
    const name = `View ${savedViews.length + 1}`;
    setDemo("megabill-saved-views", [...savedViews, { name, state }]);
    setViewsLabel(name);
    showToast("View saved");
  };
  const handleClear = () => {
    applyState(DEFAULT_VIEW_STATE);
    setViewsLabel("Views");
    showToast("View cleared");
  };
  const handleSelectView = (name: string) => {
    if (name === "Default view") {
      applyState(DEFAULT_VIEW_STATE);
      setViewsLabel("Default view");
      return;
    }
    const view = savedViews.find((v) => v.name === name);
    if (view) {
      applyState(view.state);
      setViewsLabel(name);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto bg-canvas">
      <MegaBillTopBar
        viewsLabel={viewsLabel}
        dirty={dirty}
        onSave={handleSave}
        onClear={handleClear}
        viewNames={["Default view", ...savedViews.map((v) => v.name)]}
        onSelectView={handleSelectView}
      />
      <div className="flex flex-col gap-[16px] px-[12px] pt-[4px] pb-[24px] w-full">
        <MegaBillToolbar
          mode={mode}
          onModeChange={(m) => patch({ mode: m })}
          aggregation={state.aggregation}
          onAggregationChange={(a) => patch({ aggregation: a })}
          rangeDays={state.rangeDays}
          onRangeDaysChange={(d) => patch({ rangeDays: d })}
          seriesOptions={CHART_SERIES.map((s) => s.label)}
          filteredSeries={state.filteredSeries}
          onToggleSeriesFilter={(label) =>
            patch({ filteredSeries: toggleInList(state.filteredSeries, label) })
          }
          xAxis={state.xAxis}
          onXAxisChange={(x) => patch({ xAxis: x })}
          amortized={state.amortized}
          onAmortizedChange={(a) => patch({ amortized: a })}
        />
        <div className="bg-white border border-solid border-[#eaecf0] flex flex-col rounded-[8px] w-full">
          <MegaBillChartSection
            data={chart.data}
            series={chart.series}
            xLabels={chart.xLabels}
            yLabels={chart.yLabels}
            pxPerUnit={chart.pxPerUnit}
            rotateXLabels={chart.rotateXLabels}
            metrics={kpiMetrics(mode)}
            hiddenSeries={state.hiddenSeries}
            onToggleSeries={(label) => patch({ hiddenSeries: toggleInList(state.hiddenSeries, label) })}
            onToggleAll={(hideAll) =>
              patch({ hiddenSeries: hideAll ? chart.series.map((s) => s.label) : [] })
            }
            chartType={state.chartType}
            onChartTypeChange={(t) => patch({ chartType: t })}
            groupTag={state.groupBy}
            groupOptions={GROUP_BY_OPTIONS}
            onGroupChange={(g) => patch({ groupBy: g as MegaBillGroupBy })}
            onDownloadCsv={exportCsv}
            onCopyData={copyData}
          />
          <div className="h-px w-full bg-[#eaecf0]" />
          <MegaBillActionsRow onDownloadCsv={exportCsv} onCopyData={copyData} />
          <div className="h-px w-full bg-[#eaecf0]" />
          <MegaBillTable
            rows={visible}
            baseRows={seriesFiltered}
            columnFilters={state.columnFilters}
            onToggleColumnValue={(col, value) =>
              patch({ columnFilters: toggleColumnFilter(state.columnFilters, col, value) })
            }
            sort={state.sort}
            onSortChange={(col, dir) => patch({ sort: dir ? { col, dir } : null })}
          />
        </div>
      </div>
    </div>
  );
}
