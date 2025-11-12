"use client"

import { useState, useRef } from "react"
import { Camera, Search, History, User, Home, TrendingUp, Apple, Utensils, Zap, ChevronRight, X, Check, AlertCircle } from "lucide-react"

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  timestamp: string
}

export default function ScanFoodApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'scan' | 'history' | 'profile'>('home')
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null)
  const [foodHistory, setFoodHistory] = useState<FoodItem[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulação de escaneamento de alimento
  const simulateFoodScan = () => {
    setIsScanning(true)
    
    setTimeout(() => {
      const foods = [
        { name: "maçã", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
        { name: "banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
        { name: "arroz integral", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
        { name: "frango grelhado", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { name: "brócolis", calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
        { name: "ovo cozido", calories: 155, protein: 13, carbs: 1.1, fat: 11 },
        { name: "aveia", calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
        { name: "salmão", calories: 208, protein: 20, carbs: 0, fat: 13 }
      ]
      
      const randomFood = foods[Math.floor(Math.random() * foods.length)]
      const newFood: FoodItem = {
        id: Date.now().toString(),
        ...randomFood,
        timestamp: new Date().toISOString()
      }
      
      setScannedFood(newFood)
      setIsScanning(false)
    }, 2000)
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFoodScan()
    }
  }

  const saveFoodToHistory = () => {
    if (scannedFood) {
      const updatedHistory = [scannedFood, ...foodHistory]
      setFoodHistory(updatedHistory)
      localStorage.setItem('scanfood_history', JSON.stringify(updatedHistory))
      setScannedFood(null)
      setActiveTab('history')
    }
  }

  const getTodayCalories = () => {
    const today = new Date().toDateString()
    return foodHistory
      .filter(item => new Date(item.timestamp).toDateString() === today)
      .reduce((sum, item) => sum + item.calories, 0)
  }

  const getTodayMacros = () => {
    const today = new Date().toDateString()
    const todayFoods = foodHistory.filter(item => new Date(item.timestamp).toDateString() === today)
    
    return {
      protein: todayFoods.reduce((sum, item) => sum + item.protein, 0),
      carbs: todayFoods.reduce((sum, item) => sum + item.carbs, 0),
      fat: todayFoods.reduce((sum, item) => sum + item.fat, 0)
    }
  }

  // Home Tab
  const HomeTab = () => {
    const todayCalories = getTodayCalories()
    const macros = getTodayMacros()
    const calorieGoal = 2000

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">olá! 👋</h2>
          <p className="text-emerald-50">pronto para escanear sua próxima refeição?</p>
        </div>

        {/* Daily Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">progresso de hoje</h3>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          
          <div className="space-y-4">
            {/* Calories */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">calorias</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {todayCalories} / {calorieGoal} kcal
                </span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((todayCalories / calorieGoal) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(macros.protein)}g</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">proteína</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{Math.round(macros.carbs)}g</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">carboidratos</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Math.round(macros.fat)}g</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">gordura</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab('scan')}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Camera className="w-8 h-8 mb-3" />
            <div className="text-left">
              <div className="font-bold text-lg">escanear</div>
              <div className="text-sm text-emerald-50">alimento</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <History className="w-8 h-8 mb-3 text-slate-700 dark:text-slate-300" />
            <div className="text-left">
              <div className="font-bold text-lg text-slate-900 dark:text-white">histórico</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">refeições</div>
            </div>
          </button>
        </div>

        {/* Recent Meals */}
        {foodHistory.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">refeições recentes</h3>
            <div className="space-y-3">
              {foodHistory.slice(0, 3).map((food) => (
                <div key={food.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{food.name}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{food.calories} kcal</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Scan Tab
  const ScanTab = () => (
    <div className="space-y-6">
      {!scannedFood && !isScanning && (
        <>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">escanear alimento</h2>
            <p className="text-slate-600 dark:text-slate-400">tire uma foto ou selecione da galeria</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleImageUpload}
              className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
            >
              <Camera className="w-6 h-6" />
              tirar foto
            </button>

            <button
              onClick={handleImageUpload}
              className="w-full py-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
            >
              <Search className="w-6 h-6" />
              escolher da galeria
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Search Alternative */}
          <div className="pt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ou busque por nome do alimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </>
      )}

      {isScanning && (
        <div className="text-center space-y-6 py-12">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full animate-ping opacity-20" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Camera className="w-16 h-16 text-white animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">analisando...</h3>
            <p className="text-slate-600 dark:text-slate-400">identificando o alimento</p>
          </div>
        </div>
      )}

      {scannedFood && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">alimento identificado!</h3>
            <p className="text-emerald-50">confira as informações nutricionais</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center">
                <Apple className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{scannedFood.name}</h4>
                <p className="text-slate-600 dark:text-slate-400">porção de 100g</p>
              </div>
            </div>

            {/* Calories */}
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{scannedFood.calories}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">calorias (kcal)</div>
              </div>
            </div>

            {/* Macros */}
            <div className="space-y-4">
              <h5 className="font-semibold text-slate-900 dark:text-white">macronutrientes</h5>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">proteína</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{scannedFood.protein}g</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">carboidratos</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{scannedFood.carbs}g</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">gordura</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{scannedFood.fat}g</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setScannedFood(null)}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            >
              cancelar
            </button>
            <button
              onClick={saveFoodToHistory}
              className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              salvar
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // History Tab
  const HistoryTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">histórico</h2>
        <History className="w-6 h-6 text-emerald-500" />
      </div>

      {foodHistory.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-slate-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">nenhum alimento escaneado</h3>
            <p className="text-slate-600 dark:text-slate-400">comece escaneando sua primeira refeição!</p>
          </div>
          <button
            onClick={() => setActiveTab('scan')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            escanear agora
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {foodHistory.map((food) => (
            <div key={food.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white capitalize">{food.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(food.timestamp).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{food.calories}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">kcal</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="text-center">
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">{food.protein}g</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">proteína</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">{food.carbs}g</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">{food.fat}g</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">gordura</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // Profile Tab
  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">meu perfil</h2>
          <p className="text-slate-600 dark:text-slate-400">gerencie suas informações</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">meta diária</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">2000 kcal</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">alimentos escaneados</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{foodHistory.length} itens</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/30 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">informações pessoais</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">editar perfil</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button className="w-full py-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl font-semibold hover:bg-red-100 dark:hover:bg-red-950/50 transition-all">
          sair da conta
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                scanfood
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'scan' && <ScanTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 safe-area-bottom">
        <div className="max-w-2xl mx-auto grid grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'home'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">início</span>
          </button>

          <button
            onClick={() => setActiveTab('scan')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'scan'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Camera className="w-6 h-6" />
            <span className="text-xs font-medium">escanear</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <History className="w-6 h-6" />
            <span className="text-xs font-medium">histórico</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">perfil</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
