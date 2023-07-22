import classNames from "classnames";

type FormGroupProps = {
  children: React.ReactNode;
  orientation?: "inline" | "vertical";
  className?: string;
};
export default function FormGroup({
  children,
  orientation = "vertical",
  className,
}: FormGroupProps) {
  return (
    <div
      className={classNames("flex max-w-full", className, {
        ["flex-col"]: orientation === "vertical",
        ["flex-row items-center"]: orientation === "inline",
      })}
    >
      {children}
    </div>
  );
}
