const MainHeader = (props) => {
  return (
    <header className={`fixed-top shadow bg-defecto`}>{props.children}</header>
  );
};

export default MainHeader;
