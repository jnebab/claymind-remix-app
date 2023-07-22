type ContainerProps = {
  children: React.ReactNode;
};
export default function Container({ children }: ContainerProps) {
  return <div className="container mx-auto pt-10 text-base">{children}</div>;
}
