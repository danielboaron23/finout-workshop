import { Suspense } from "react";
import { CreateAnomalyScreen } from "@/screens/CreateAnomalyScreen";

/*
 * CreateAnomalyScreen reads the "edit" search param via useSearchParams, so
 * Next requires it inside a Suspense boundary (the client child is rendered
 * client-side; the rest of the route stays prerenderable).
 */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <CreateAnomalyScreen />
    </Suspense>
  );
}
