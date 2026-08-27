-- Finout Workshop — mock product database schema (Supabase / Postgres)
-- Run this FIRST in the Supabase SQL editor, then run seed.sql.
--
-- The data mirrors the workshop prototype: the MegaBill chart providers,
-- the Home dashboard cost centers, the Anomalies feed card, and the
-- Virtual Tags screen — so insights found here match what participants
-- see on screen.

begin;

drop view if exists v_service_week_over_week;
drop view if exists v_team_monthly_spend;
drop view if exists v_monthly_provider_costs;
drop table if exists budgets;
drop table if exists anomalies;
drop table if exists cost_events;
drop table if exists virtual_tags;
drop table if exists services;
drop table if exists teams;

create table teams (
  id int primary key,
  name text not null unique,
  department text not null,
  lead_name text not null,
  monthly_budget_usd numeric(12,2) not null
);
comment on table teams is 'Engineering/product teams that own cloud spend';

create table services (
  id int primary key,
  name text not null unique,
  provider text not null,   -- matches the MegaBill chart series (AWS, GCP, Kubernetes, ...)
  category text not null,   -- Compute / Storage / Database / Analytics / Observability / AI / CI-CD
  usage_unit text not null  -- what usage_qty counts: instance-hours, GB, tokens, credits...
);
comment on table services is 'Billable cloud services; provider matches the MegaBill chart series';

create table cost_events (
  id bigint generated always as identity primary key,
  usage_date date not null,
  service_id int not null references services(id),
  team_id int not null references teams(id),
  environment text not null check (environment in ('production','staging')),
  region text not null,
  usage_qty numeric(14,2) not null,
  cost_usd numeric(12,2) not null
);
create index cost_events_date_idx on cost_events (usage_date);
create index cost_events_service_idx on cost_events (service_id);
create index cost_events_team_idx on cost_events (team_id);
comment on table cost_events is 'Daily cost + usage per service, team, environment (Mar–Aug 2026)';

create table virtual_tags (
  id int primary key,
  name text not null,
  folder text,
  tag_type text not null check (tag_type in ('Virtual Tag','Relational Virtual Tag')),
  created_by text,          -- user initials; null = Finout built-in
  rule jsonb not null,
  created_at date not null,
  updated_at date not null
);
comment on table virtual_tags is 'Mirrors the Virtual Tags screen in the prototype';

create table anomalies (
  id int primary key,
  detected_at date not null,
  service_id int references services(id),
  team_id int references teams(id),
  metric text not null check (metric in ('cost','usage')),
  severity text not null check (severity in ('low','medium','high')),
  expected_value numeric(14,2) not null,
  actual_value numeric(14,2) not null,
  pct_change numeric(6,1) not null,
  cost_impact_usd numeric(12,2),
  status text not null check (status in ('open','acknowledged','resolved')),
  description text not null
);
comment on table anomalies is 'What Finout''s anomaly detection flagged. NOTE: it does not catch everything in cost_events...';

create table budgets (
  team_id int not null references teams(id),
  month date not null,          -- first day of month
  budget_usd numeric(12,2) not null,
  forecast_usd numeric(12,2) not null,
  primary key (team_id, month)
);
comment on table budgets is 'Monthly budget vs forecast per team';

-- Convenience views so non-SQL people get instant answers -------------------

create view v_monthly_provider_costs as
select date_trunc('month', e.usage_date)::date as month,
       s.provider,
       round(sum(e.cost_usd), 2) as total_cost_usd
from cost_events e
join services s on s.id = e.service_id
group by 1, 2
order by 1, 2;

create view v_team_monthly_spend as
select date_trunc('month', e.usage_date)::date as month,
       t.name as team,
       round(sum(e.cost_usd), 2) as total_cost_usd
from cost_events e
join teams t on t.id = e.team_id
group by 1, 2
order by 1, 2;

create view v_service_week_over_week as
with weekly as (
  select date_trunc('week', e.usage_date)::date as week,
         s.name as service,
         sum(e.cost_usd) as cost
  from cost_events e
  join services s on s.id = e.service_id
  group by 1, 2
)
select week, service, round(cost, 2) as cost_usd,
       round(100.0 * (cost - lag(cost) over (partition by service order by week))
             / nullif(lag(cost) over (partition by service order by week), 0), 1)
         as wow_change_pct
from weekly
order by service, week;

commit;

-- Read-only role for workshop participants ----------------------------------
-- Run separately, AFTER choosing a password. Participants connect with this
-- role through the Postgres MCP server (see README.md).

-- create role workshop_reader login password 'CHOOSE_A_PASSWORD';
-- grant usage on schema public to workshop_reader;
-- grant select on all tables in schema public to workshop_reader;
-- alter default privileges in schema public grant select on tables to workshop_reader;
