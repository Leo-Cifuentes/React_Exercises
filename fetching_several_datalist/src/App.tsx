
import Button from './components/Button';
import './App.css'
import { useEffect, useState } from 'react';

const URL_API_WORLD: string = ('https://countriesnow.space/api/v0.1/countries');

type Country = {
  country: string;
  cities: string[];
  iso2: string;
  iso3: string;
};

type ApiResponse = {
  error: boolean;
  msg: string;
  data: Country[];
};


function App() {
  const [dataWorld, setDataWorld] = useState<ApiResponse | null>(null);
  const [errorWorld, setErrorWorld] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const fetchWorld = async () => {
    setIsLoading(true)
    try {
      const responseWorld = await fetch(URL_API_WORLD);
      if (!responseWorld.ok) {
        throw new Error(`Error con los datos, Código de estado: ${responseWorld.status}.`)
      }
      const result = await responseWorld.json();
      setDataWorld(result);
    }
    catch (err) {
      setErrorWorld(err as Error);
    }
    finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className='w-full flex justify-center h-screen items-center'>
        <h1 className='text-4xl text-white'>Cargando...</h1>
      </div>
    )
  }
  if (errorWorld) {
    return <h3>Error: ${errorWorld.message}</h3>
  }

  const searchMatch = debouncedSearch.toLowerCase();

  const filteredResults = dataWorld?.data.filter((item) => {

    return (
      searchMatch === '' ||
      item.country.toLowerCase().includes(searchMatch) ||
      item.cities.some(city =>
        city.toLowerCase().includes(searchMatch)
      )
    );
  })

  const highlightMatch = (text: string, searchMatch: string) => {
    if (!searchMatch.trim()) return text;

    const regex = new RegExp(`(${searchMatch})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === searchMatch.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 text-black rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };


  return (
    <>
      <main className='w-full bg-slate-800'>
        <section className='max-w-5xl mx-auto py-8'>
          <h1 className='text-4xl text-center text-gray-300'>
            Try to fetch some data
          </h1>
        </section>
        <section className='flex justify-center-safe max-w-5xl mx-auto'>
          <Button buttonText='Countries & Cities' onFetch={fetchWorld} />
        </section>
        <hr />
        <section className='flex justify-center-safe max-w-5xl mx-auto'>
          <input type="text"
            name='searchBar'
            placeholder='Buscar país o ciudad...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='my-2 px-4 py-2 bg-white min-w-xl rounded-sm'
          />
        </section>
        <hr />
        <section className='flex justify-center max-w-5xl mx-auto my-8 h-28'>
          <table className="table-fixed border-collapse border border-gray-800 rounded-2xl bg-slate-500 min-w-5xl">
            <thead className='bg-slate-700 px-4 py-8 '>
              <tr className='text-white '>
                <th className='p-4 border border-gray-800'>Abreviation</th>
                <th className='px-8 py-4 border border-gray-800'>Name</th>
                <th className='px-8 py-4 border border-gray-800'>Cities</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredResults?.map((item) => (
                  <tr className='text-gray-900' key={item.iso2}>
                    <td className='pl-4 pt-2 border border-gray-800 font-bold align-top'>{item.iso3}</td>
                    <td className='pt-2 text-center border border-gray-800 font-medium align-top'>{highlightMatch(item.country, searchTerm)}</td>
                    <td className='p-2 border border-gray-800'>
                      {
                        <td>
                          {item.cities
                            .filter(city =>
                              city.toLowerCase().includes(searchMatch)
                            )
                            .slice(0, 8)
                            .map((city, index) => (
                              <span key={index}>
                                {highlightMatch(city, searchTerm)}
                                {index < 7 && ', '}
                              </span>
                            ))}
                        </td>

                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </section>
      </main>
    </>
  )
}

export default App;
