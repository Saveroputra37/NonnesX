import Feed from "./lib/feed";
const Indexpage = () => {
  return (
    <div className="w-full h-screen overflow-y-auto px-5 py-2 no-scrollbar flex-col flex items-center">
      <Feed />
    </div>
  );
};

export default Indexpage;
