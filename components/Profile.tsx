"use server";

import Image from "next/image";

export default async function UserProfile(
  {
    user 
  }: {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      createdAt?: string | null;
    }
  }) {
  return (
    <div className="bg-white text-black shadow-lg rounded-lg p-6 max-w-sm mx-auto">
      <div className="flex flex-col items-center">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "Your Profile Picture"}
            width={0}
            height={0}
            className="w-24 h-24 rounded-full mb-4"
            unoptimized
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
            <span className="text-xl text-white">{user.name}</span>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
        <p>{user.email}</p>
        <p className="text-gray-600">Joined on {new Date(user.createdAt as string).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
