import { useState, useEffect } from 'react'
import axios from 'axios'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ExternalLink, TrendingDown, Car, AlertTriangle, Calculator } from 'lucide-react'

function App() {
  const [stats, setStats] = useState(null)
  const [cars, setCars] = useState([])
  
  const [marque, setMarque] = useState('Geely')
  const [annee, setAnnee] = useState(2026)
  const [predictedPrice, setPredictedPrice] = useState(null)
  const [loadingPredict, setLoadingPredict] = useState(false)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error("Erreur API Stats:", error))

    axios.get('http://127.0.0.1:8000/api/cars?limit=200')
      .then(response => setCars(response.data))
      .catch(error => console.error("Erreur API Cars:", error))
  }, [])

  const handlePredict = (e) => {
    e.preventDefault()
    setLoadingPredict(true)
    axios.get(`http://127.0.0.1:8000/api/predict?marque=${marque}&annee=${annee}`)
      .then(response => {
        setPredictedPrice(response.data.prix_estime_millions)
        setLoadingPredict(false)
      })
      .catch(error => {
        console.error("Erreur Prediction:", error)
        setLoadingPredict(false)
      })
  }

  const anomaliesList = cars.filter(car => car.Anomalie === -1)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-800">End-to-End Market Intelligence</h1>
          <p className="text-slate-500 mt-2">Plateforme d'analyse des prix, détection des anomalies et prédiction ML</p>
        </div>

        {!stats || cars.length === 0 ? (
          <div className="text-center py-20 text-xl text-slate-500 animate-pulse">Rana njibou f les données...</div>
        ) : (
          <>
            {/* Les Cartes (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500 flex items-center justify-between">
                <div>
                  <h2 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Annonces</h2>
                  <p className="text-3xl font-black text-slate-700 mt-1">{stats.total_cars}</p>
                </div>
                <Car className="text-blue-200" size={48} />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-emerald-500 flex items-center justify-between">
                <div>
                  <h2 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Prix Moyen</h2>
                  <p className="text-3xl font-black text-slate-700 mt-1">{stats.prix_moyen_millions} M</p>
                </div>
                <TrendingDown className="text-emerald-200" size={48} />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-rose-500 flex items-center justify-between">
                <div>
                  <h2 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Anomalies</h2>
                  <p className="text-3xl font-black text-rose-600 mt-1">{stats.total_anomalies}</p>
                </div>
                <AlertTriangle className="text-rose-200" size={48} />
              </div>
            </div>

            {/* Section 2 : ML Predictor & Graphe */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Formulaire de Prédiction (1 Colonne) */}
              <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-slate-800">Simulateur de Prix</h2>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">Estimez le prix d'une voiture selon sa marque et son année grâce au Machine Learning.</p>
                  
                  <form onSubmit={handlePredict} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Marque</label>
                      <input 
                        type="text" 
                        value={marque} 
                        onChange={(e) => setMarque(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ex: Geely, Skoda, Volkswagen..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Année</label>
                      <input 
                        type="number" 
                        value={annee} 
                        onChange={(e) => setAnnee(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer">
                      {loadingPredict ? "Calcul en cours..." : "Prédire le Prix"}
                    </button>
                  </form>
                </div>

                {/* Resultat taà la prediction */}
                {predictedPrice !== null && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-center animate-fade-in">
                    <p className="text-xs text-blue-600 uppercase font-bold">Prix Estimé</p>
                    <p className="text-3xl font-black text-blue-700 mt-1">{predictedPrice} Millions DA</p>
                  </div>
                )}
              </div>

              {/* L'Graphe (2 Colonnes) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Distribution des Prix par Année</h2>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                      <XAxis dataKey="Annee" type="number" name="Année" domain={['dataMin', 'dataMax']} tickCount={10} />
                      <YAxis dataKey="Prix_Millions" type="number" name="Prix (Millions)" unit="M" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Voitures" data={cars}>
                        {cars.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.Anomalie === -1 ? '#ef4444' : '#3b82f6'} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Prix Normal</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Anomalie (A vérifier)</span>
                </div>
              </div>

            </div>

            {/* Tableau des Anomalies */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Détails des Anomalies Détectées (Bonnes Affaires / Arnaques)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                      <th className="p-4 font-semibold">Titre de l'annonce</th>
                      <th className="p-4 font-semibold">Année</th>
                      <th className="p-4 font-semibold">Prix (Millions)</th>
                      <th className="p-4 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-slate-100">
                    {anomaliesList.map((anomalie, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-700">{anomalie.Titre}</td>
                        <td className="p-4 text-slate-600">{anomalie.Annee}</td>
                        <td className="p-4 font-bold text-rose-600">{anomalie.Prix_Millions}</td>
                        <td className="p-4 text-center">
                          <a href={anomalie.Lien} target="_blank" rel="noopener noreferrer" 
                             className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-full transition-colors">
                            Voir <ExternalLink size={14} />
                          </a>
                        </td>
                      </tr>
                    ))}
                    {anomaliesList.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500">Aucune anomalie à afficher pour le moment.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  )
}

export default App