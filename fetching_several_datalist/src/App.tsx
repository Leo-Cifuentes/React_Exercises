
import React, { useEffect, useState, useRef } from 'react';
import Button from './components/Button';
import ScrollToTopButton from './components/ScrollToTopButton';
import Modal from './components/Modal';
import './App.css'

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
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //-- Fetch Data --
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

  //-- Debounce for search --
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  //-- Reset page when search changes --
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  //-- UseEffect for Highlighting search --
  useEffect(() => {
    if (!tableRef.current) return;

    const cells = tableRef.current.querySelectorAll('td');

    // Reset
    cells.forEach(cell => {
      const text = cell.textContent;
      if (text) cell.innerHTML = text;
    });

    const term = debouncedSearch.trim();
    if (!term) return;

    const regex = new RegExp(`(${term})`, 'gi');

    cells.forEach(cell => {
      const text = cell.textContent;
      if (!text) return;

      cell.innerHTML = text.replace(
        regex,
        `<mark class="bg-yellow-200 text-black font-semibold px-1 mx-1 rounded">$1</mark>`
      );
    });

  }, [debouncedSearch, currentPage]);

  //-- Loading message & Error message --
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

  //-- SearchBar Logic --
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

  //-- Pagination --
  const rowsPerPage = 10;

  const totalRows = filteredResults?.length || 0;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredResults?.slice(
    indexOfFirstRow,
    indexOfLastRow
  )

  const totalPages = Math.ceil(totalRows / rowsPerPage);


  return (
    <>
      <main className='w-full bg-slate-800'>
        <section className='max-w-5xl mx-auto py-8'>
          <h1 className='text-4xl text-center text-gray-300'>
            Try to fetch some data
          </h1>
        </section>
        <section className='flex justify-center-safe max-w-5xl mx-auto'>
          <Button buttonText='Countries & Cities' onClick={fetchWorld} />
        </section>
        <hr />
        <section className='flex justify-center-safe max-w-5xl mx-auto'>
          <form className='my-2 min-w-xl max-w-2xl mx-auto'>
            <label htmlFor="search" className="block mb-2.5 text-sm font-medium text-heading sr-only ">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
              </div>
              <input type="search"
                name="searchBar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full p-3 ps-9 bg-white border border-default-medium text-heading text-sm rounded-2xl focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                placeholder="Buscar país o ciudad..."
                required />
            </div>
          </form>
        </section>
        <hr />
        <section>
          <div className='flex justify-center-safe max-w-5xl mx-auto'>
            <Button
              buttonText='Ver Info'
              onClick={() => {
                setModalContent(
                  <>
                    <h1 className='text-2xl font-bold'>Title</h1>
                    <p>First paragraph.</p>
                    <p>Second Paragraph.</p>
                  </>
                );
                setIsModalOpen(true);
              }
              } />
          </div>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {modalContent}
          </Modal>
          {
            dataWorld && totalRows > 0 && (
              <div className="flex justify-center gap-4 mt-4 mb-10">
                <button className='py-1 px-3 bg-cyan-100 rounded-2xl cursor-pointer'
                  onClick={() =>
                    setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>

                <span className='text-cyan-100'>
                  Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                </span>

                <button className='py-1 px-3 bg-cyan-100 rounded-2xl cursor-pointer'
                  onClick={() =>
                    setCurrentPage(prev => Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
                <ScrollToTopButton />
              </div>
            )
          }
        </section>
        <section className='flex justify-center max-w-5xl mx-auto my-8'>
          <table ref={tableRef} className="table-fixed border-collapse border border-gray-800 rounded-2xl bg-slate-500 min-w-5xl">
            <thead className='bg-slate-700 px-4 py-8 '>
              <tr className='text-white '>
                <th className='p-4 border border-gray-800'>Abreviation</th>
                <th className='px-8 py-4 border border-gray-800'>Name</th>
                <th className='px-8 py-4 border border-gray-800'>Cities</th>
              </tr>
            </thead>
            <tbody>
              {
                currentRows?.map((item) => (
                  <tr className='text-gray-900' key={item.iso2}>
                    <td className='pl-4 pt-2 border border-gray-800 font-bold align-top'>{item.iso3}</td>
                    <td className='pt-2 text-center border border-gray-800 font-medium align-top'>{item.country}</td>
                    <td className='p-2 border border-gray-800'>

                      {item.cities.join(', ')}

                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </section>
        <section>
          <div className="flex justify-center gap-4 mt-4 mb-10">
            <button className='py-1 px-3 bg-cyan-100 rounded-2xl cursor-pointer'
              onClick={() =>
                setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            <span className='text-cyan-100'>
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
            </span>

            <button className='py-1 px-3 bg-cyan-100 rounded-2xl cursor-pointer'
              onClick={() =>
                setCurrentPage(prev => Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

export default App;