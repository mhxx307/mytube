import Header from "./Header";

function BasicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header className="fixed top-0 left-0 right-0 z-10" />
            <div className="pt-16" />
            <div className="">{children}</div>
        </div>
    );
}

export default BasicLayout;
