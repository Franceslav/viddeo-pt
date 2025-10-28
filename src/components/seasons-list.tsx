"use client";

import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/app/_trpc/client";
import { seasonSlug } from "@/lib/slugify";

export default function SeasonsList() {
  const { data: seasons, isLoading, error } = trpc.season.getSeasons.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center text-white p-4 bg-gray-800 rounded-lg animate-pulse">
            <div className="w-full h-48 bg-gray-600 rounded-lg mb-3"></div>
            <div className="h-6 bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-lg font-bold mb-2">Ошибка загрузки сезонов</h3>
        <p>Попробуйте обновить страницу</p>
      </div>
    );
  }

  if (!seasons || seasons.length === 0) {
    return (
      <div className="text-center text-white p-4">
        <h3 className="text-lg font-bold mb-2">Сезоны пока не добавлены</h3>
        <p>Администратор может добавить сезоны через админку</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
      {seasons.map((season) => {
        const url = `/${seasonSlug(season.seasonNumber)}`;
        console.log('Season data:', season.seasonNumber, 'Image:', season.image);
        
        return (
          <Link 
            key={season.id} 
            href={url}
            className="group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1"
          >
            {/* Постер сезона */}
            <div className="relative h-64 overflow-hidden">
              {season.image ? (
                <Image
                  src={season.image}
                  alt={`Сезон ${season.seasonNumber}`}
                  width={300}
                  height={256}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center">
                  <span className="text-6xl font-black text-white" style={{ textShadow: '2px 2px 0px #000000' }}>
                    S{season.seasonNumber}
                  </span>
                </div>
              )}
              
              {/* Градиентный оверлей */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Номер сезона в углу */}
              <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                Сезон {season.seasonNumber}
              </div>
              
              {/* Количество эпизодов */}
              <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                {season.episodes?.length || 0} эп.
              </div>
            </div>
            
            {/* Информация о сезоне */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                {season.title || `Сезон ${season.seasonNumber}`}
              </h3>
              
              {season.year && (
                <p className="text-sm text-gray-400 mb-2">
                  Год: {season.year}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {season.episodes?.length || 0} эпизодов
                </span>
                <div className="text-yellow-400 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}