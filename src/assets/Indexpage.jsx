import { Command, Heart, MessageCircle, Waypoints } from 'lucide-react';
import React from 'react'

const Indexpage = () => {
    let sekarang = new Date();
    const data = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        image:
          "https://img.freepik.com/free-photo/horizontal-portrait-smiling-happy-young-pleasant-looking-female-wears-denim-shirt-stylish-glasses-with-straight-blonde-hair-expresses-positiveness-poses_176420-13176.jpg?semt=ais_incoming&w=740&q=80",
        createdat: sekarang,
        detailpost: [
          {
            id: 1,
            title: "Sample Post",
            content: "This is a sample post.",
            image_post:
              "https://blog.bankmega.com/wp-content/uploads/2025/07/Taman-Langit-Pangalengan-menawarkan-pemandangan-alam-menakjubkan.jpg",
            createdat: sekarang,
            Like: 10,
            Comment: 5,
            shared: 2,
          },
        ],
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        image:
          "https://img.freepik.com/free-photo/horizontal-portrait-smiling-happy-young-pleasant-looking-female-wears-denim-shirt-stylish-glasses-with-straight-blonde-hair-expresses-positiveness-poses_176420-13176.jpg?semt=ais_incoming&w=740&q=80",
        createdat: sekarang,
        detailpost: [
          {
            id: 2,
            title: "Another Post",
            content: "lorem ipsum",
            image_post:
              "https://blog.bankmega.com/wp-content/uploads/2025/07/Taman-Langit-Pangalengan-menawarkan-pemandangan-alam-menakjubkan.jpg",
            createdat: sekarang,
            Like: 15,
            Comment: 8,
            shared: 3,
          },
        ],
      },
    ];




  return (
    <div className="w-[50%] py-3 px-5">
      {data.map((item) => (
        <div key={item.id} className="py-4 bg-white rounded-xl shadow-md mb-4">
          <div className="flex items-center mb-4 px-4">
            <img
              src={item.image}
              alt={item.name}
              className="size-11 rounded-full mr-4 object-cover"
            />
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-gray-600">{item.email}</p>
            </div>
          </div>
          {item.detailpost.map((post) => (
            <div key={post.id} className="mb-4">
              <p className="text-gray-700 px-4">{post.content}</p>
              <div className="w-full flex items-center justify-center bg-gray-500/15 py-4">
                <img
                  src={post.image_post}
                  alt={post.title}
                  className="w-fit max-h-60 object-cover rounded-sm"
                />
              </div>
              <div className="flex items-center mt-2 px-4">
                <p className="text-sm text-gray-600 mr-4 flex items-center gap-x-1">
                  <Heart size={17} />
                  <p className="font-bold">{post.Like}</p>
                </p>
                <p className="text-sm text-gray-600 mr-4 flex items-center gap-x-1">
                  <MessageCircle size={17} />{" "}
                  <p className="font-bold">{post.Comment}</p>
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-x-1">
                  <Waypoints size={17} />{" "}
                  <p className="font-bold">{post.shared}</p>
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Indexpage