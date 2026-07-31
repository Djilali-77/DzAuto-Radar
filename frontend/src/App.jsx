import { useState, useEffect } from 'react'
import axios from 'axios'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ExternalLink, TrendingDown, Car, AlertTriangle, Calculator, Moon, Sun } from 'lucide-react'

const API_BASE_URL = "https://car-market-pipeline.onrender.com"

function App() {
  const [stats, setStats] = useState(null)
  const [cars, setCars] = useState([])
  
  const [brand, setBrand] = useState('Geely')
  const [year, setYear] = useState(2026)
  const [predictedPrice, setPredictedPrice] = useState(null)
  const [loadingPredict, setLoadingPredict] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [maxPriceFilter, setMaxPriceFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/stats`)
      .then(response => setStats(response.data))
      .catch(error => console.error("API Stats Error:", error))

    axios.get(`${API_BASE_URL}/api/cars?limit=200`)
      .then(response => setCars(response.data))
      .catch(error => console.error("API Cars Error:", error))
  }, [])

  const handlePredict = (e) => {
    e.preventDefault()
    setLoadingPredict(true)
    axios.get(`${API_BASE_URL}/api/predict?brand=${brand}&year=${year}`)
      .then(response => {
        setPredictedPrice(response.data.estimated_price_millions)
        setLoadingPredict(false)
      })
      .catch(error => {
        console.error("Prediction Error:", error)
        setLoadingPredict(false)
      })
  }

  const anomaliesList = cars.filter(car => car.Anomaly === -1)

  // Dynamic Theme Classes
  const bgTheme = isDarkMode ? "bg-slate-900" : "bg-gray-50"
  const cardTheme = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
  const textTheme = isDarkMode ? "text-slate-100" : "text-slate-800"
  const subTextTheme = isDarkMode ? "text-slate-400" : "text-slate-500"
  const inputTheme = isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-slate-800"

  // 1. On récupère les anomalies
  const baseAnomalies = cars.filter(car => car.Anomaly === -1)

  // 2. On applique les filtres (Recherche par Titre wla Prix Max)
  const filteredAnomalies = baseAnomalies.filter(car => {
    const matchesSearch = car.Title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = maxPriceFilter ? car.Price_Millions <= Number(maxPriceFilter) : true
    return matchesSearch && matchesPrice
  })

  // 3. On calcule la Pagination
  const totalPages = Math.ceil(filteredAnomalies.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  
  // Hadi hiya la liste li ghadin n'affichiwha f'le tableau
  const currentAnomalies = filteredAnomalies.slice(indexOfFirstItem, indexOfLastItem)

  // Fonction bach n'badlo la page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)


  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${bgTheme}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Theme Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h1 className={`text-4xl font-extrabold tracking-tight transition-colors ${textTheme}`}>
              End-to-End Market Intelligence
            </h1>
            <p className={`mt-2 text-lg transition-colors ${subTextTheme}`}>
              Price analysis, anomaly detection, and ML prediction platform
            </p>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' : 'bg-white hover:bg-slate-100 text-slate-800 shadow-sm'}`}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {!stats || cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 animate-pulse">
            <div className={`w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin`}></div>
            <p className={`text-xl font-medium ${subTextTheme}`}>Fetching data from Render...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* KPIs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl shadow-sm border ${cardTheme} border-t-4 border-t-blue-500 flex items-center justify-between transition-all hover:shadow-md`}>
                <div>
                  <h2 className="text-blue-500 text-sm font-bold uppercase tracking-wider">Total Listings</h2>
                  <p className={`text-3xl font-black mt-1 ${textTheme}`}>{stats.total_cars}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Car className="text-blue-500" size={32} />
                </div>
              </div>

              <div className={`p-6 rounded-2xl shadow-sm border ${cardTheme} border-t-4 border-t-emerald-500 flex items-center justify-between transition-all hover:shadow-md`}>
                <div>
                  <h2 className="text-emerald-500 text-sm font-bold uppercase tracking-wider">Average Price</h2>
                  <p className={`text-3xl font-black mt-1 ${textTheme}`}>{stats.average_price_millions} M</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <TrendingDown className="text-emerald-500" size={32} />
                </div>
              </div>

              <div className={`p-6 rounded-2xl shadow-sm border ${cardTheme} border-t-4 border-t-rose-500 flex items-center justify-between transition-all hover:shadow-md`}>
                <div>
                  <h2 className="text-rose-500 text-sm font-bold uppercase tracking-wider">Anomalies Detected</h2>
                  <p className="text-3xl font-black text-rose-500 mt-1">{stats.total_anomalies}</p>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-xl">
                  <AlertTriangle className="text-rose-500" size={32} />
                </div>
              </div>
            </div>

            {/* Section 2 : ML Predictor & Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Prediction Form */}
              <div className={`p-6 rounded-2xl shadow-sm border ${cardTheme} flex flex-col justify-between transition-all`}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Calculator className="text-blue-500" size={24} />
                    </div>
                    <h2 className={`text-xl font-bold ${textTheme}`}>Price Simulator</h2>
                  </div>
                  <p className={`text-sm mb-6 ${subTextTheme}`}>
                    Estimate the price of a vehicle based on its brand and year using Machine Learning.
                  </p>
                  
                  <form onSubmit={handlePredict} className="space-y-5">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${textTheme}`}>Brand</label>
                      <input 
                        type="text" 
                        value={brand} 
                        onChange={(e) => setBrand(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${inputTheme}`}
                        placeholder="Ex: Geely, Skoda, Volkswagen..."
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${textTheme}`}>Year</label>
                      <input 
                        type="number" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${inputTheme}`}
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loadingPredict}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed">
                      {loadingPredict ? "Calculating..." : "Predict Price"}
                    </button>
                  </form>
                </div>

                {/* Prediction Result */}
                {predictedPrice !== null && (
                  <div className={`mt-6 p-5 border rounded-xl text-center transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-blue-50 border-blue-100'}`}>
                    <p className={`text-xs uppercase font-bold tracking-wider ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Estimated Price</p>
                    <p className={`text-3xl font-black mt-2 ${isDarkMode ? 'text-white' : 'text-blue-700'}`}>
                      {predictedPrice} <span className="text-xl">M DA</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Scatter Chart */}
              <div className={`lg:col-span-2 p-6 rounded-2xl shadow-sm border ${cardTheme} transition-all`}>
                <h2 className={`text-xl font-bold mb-6 ${textTheme}`}>Price Distribution by Year</h2>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke={isDarkMode ? '#cbd5e1' : '#64748b'} />
                      <XAxis 
                        dataKey="Year" 
                        type="number" 
                        name="Year" 
                        domain={['dataMin', 'dataMax']} 
                        tickCount={10}
                        stroke={isDarkMode ? '#94a3b8' : '#475569'} 
                      />
                      <YAxis 
                        dataKey="Price_Millions" 
                        type="number" 
                        name="Price (Millions)" 
                        unit="M" 
                        stroke={isDarkMode ? '#94a3b8' : '#475569'} 
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ 
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
                          border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          color: isDarkMode ? '#f8fafc' : '#0f172a'
                        }}
                      />
                      <Scatter name="Cars" data={cars}>
                        {cars.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.Anomaly === -1 ? '#f43f5e' : '#3b82f6'} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className={`flex justify-center gap-6 mt-6 text-sm font-medium ${subTextTheme}`}>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div> 
                    Normal Price
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></div> 
                    Anomaly (Review Required)
                  </span>
                </div>
              </div>

            </div>

            {/* Anomalies Data Table */}
            {/* Tableau des Anomalies avec Filtres et Pagination */}
            <div className={`rounded-2xl shadow-sm border ${cardTheme} overflow-hidden transition-all`}>
              
              {/* Header + Search/Filtres */}
              <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'} flex flex-col md:flex-row justify-between items-center gap-4`}>
                <h2 className={`text-xl font-bold ${textTheme}`}>Anomaly Details</h2>
                
                <div className="flex gap-3 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Chercher une marque..." 
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1) // N'raj3ouh l'page 1 ki ybda y'cherchi
                    }}
                    className={`px-4 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-rose-500 outline-none w-full md:w-48 transition-all ${inputTheme}`}
                  />
                  <input 
                    type="number" 
                    placeholder="Prix Max (M)" 
                    value={maxPriceFilter}
                    onChange={(e) => {
                      setMaxPriceFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className={`px-4 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-rose-500 outline-none w-full md:w-32 transition-all ${inputTheme}`}
                  />
                </div>
              </div>

              {/* Le Tableau */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`${isDarkMode ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'} text-xs uppercase tracking-wider`}>
                      <th className="p-4 font-semibold">Listing Title</th>
                      <th className="p-4 font-semibold">Year</th>
                      <th className="p-4 font-semibold">Price (Millions)</th>
                      <th className="p-4 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                    {/* Hna n'khadmo b currentAnomalies au lieu de anomaliesList */}
                    {currentAnomalies.map((anomaly, idx) => (
                      <tr key={idx} className={`${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'} transition-colors`}>
                        <td className={`p-4 font-medium ${textTheme}`}>{anomaly.Title}</td>
                        <td className={`p-4 ${subTextTheme}`}>{anomaly.Year}</td>
                        <td className="p-4 font-bold text-rose-500">{anomaly.Price_Millions}</td>
                        <td className="p-4 text-center">
                          <a href={anomaly.Link} target="_blank" rel="noopener noreferrer" 
                             className={`inline-flex items-center gap-1.5 font-medium px-4 py-1.5 rounded-full transition-colors ${
                               isDarkMode 
                                ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                             }`}>
                            View <ExternalLink size={14} />
                          </a>
                        </td>
                      </tr>
                    ))}
                    {currentAnomalies.length === 0 && (
                      <tr>
                        <td colSpan="4" className={`p-8 text-center ${subTextTheme}`}>
                          Aucune anomalie ne correspond à ta recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Les contrôles de Pagination */}
              {totalPages > 1 && (
                <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50'} flex justify-between items-center`}>
                  <p className={`text-sm ${subTextTheme}`}>
                    Page <span className="font-bold">{currentPage}</span> sur <span className="font-bold">{totalPages}</span>
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => paginate(currentPage - 1)} 
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === 1 
                          ? 'opacity-50 cursor-not-allowed text-slate-400 bg-transparent' 
                          : isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white border hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      Précédent
                    </button>
                    <button 
                      onClick={() => paginate(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === totalPages 
                          ? 'opacity-50 cursor-not-allowed text-slate-400 bg-transparent' 
                          : isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white border hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default App