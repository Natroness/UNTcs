import { redirect } from "next/navigation";

export const metadata = {
  title: "Transfer Audit · UNT CS Degree Tracker",
};

export default function TransferAuditPage() {
  redirect("/#transfer-audit");
}
