import { checkUserIsAdmin } from "@/pages/admin";

type DashboardProps = { userId: string };

export default function Dashboard({ userId }: DashboardProps) {
  return (
    <section>
      <h5>Dashboard {userId}</h5>
      {checkUserIsAdmin && "yes they is"}
    </section>
  );
}
