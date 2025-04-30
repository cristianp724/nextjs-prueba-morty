'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  location: {
    name: string;
  };
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('https://rickandmortyapi.com/api/character');
        const data = await response.json();
        setCharacters(data.results);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los personajes');
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-[100px] opacity-30"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white relative z-10"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-[100px] opacity-30"></div>
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-white relative z-10">
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 py-8 px-4 relative overflow-hidden">
      {/* Efecto de partículas */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
      
      {/* Efecto de blur */}
      <div className="absolute inset-0 backdrop-blur-[100px] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-white">Personajes de Rick and Morty</h1>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar personaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCharacters.map((character) => (
            <div
              key={character.id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:border-purple-400 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="relative h-64">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => toggleFavorite(character.id)}
                  className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  {favorites.includes(character.id) ? (
                    <FaHeart className="text-red-500" size={20} />
                  ) : (
                    <FaRegHeart className="text-white" size={20} />
                  )}
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-2">{character.name}</h2>
                <div className="space-y-2">
                  <p className="text-sm text-white/80">
                    <span className="font-medium">Estado:</span>{' '}
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      character.status === 'Alive' ? 'bg-green-500' : 
                      character.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></span>
                    {character.status}
                  </p>
                  <p className="text-sm text-white/80">
                    <span className="font-medium">Especie:</span> {character.species}
                  </p>
                  <p className="text-sm text-white/80">
                    <span className="font-medium">Género:</span> {character.gender}
                  </p>
                  <p className="text-sm text-white/80">
                    <span className="font-medium">Ubicación:</span> {character.location.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 