const STATUS_STYLES = {
  PENDING: "bg-warning-light text-warning",
  PROCESSING: "bg-info-light text-info",
  SHIPPED: "bg-primary-light text-primary-dark",
  DELIVERED: "bg-primary text-white",
  CANCELLED: "bg-danger-light text-danger",
};

export default function OrderStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-bg text-ink-soft";
  return <span className={`badge ${style}`}>{status}</span>;
}
