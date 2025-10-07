import WorkspaceNavbar from "./(components)/workspace-navbar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <WorkspaceNavbar />
        {children}
    </div>
  );
}