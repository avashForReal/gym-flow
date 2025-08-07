import { useState } from 'react'
import { workoutTypes, getProgressColor, getPlateColor, gymColorClasses } from '@/lib/colors'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Modern gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-accent/5 -z-10" />
      
      <div className="relative">
        {/* Header with glassmorphism */}
        <header className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-2xl">
                  🔥
                </div>
      <div>
                  <h1 className="text-3xl font-black gradient-text tracking-tight">
                    GYMFLOW
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                    PERFORMANCE TRACKER
                  </p>
                </div>
      </div>
              
              <button
                onClick={toggleDarkMode}
                className="modern-btn px-4 py-2 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-xl font-semibold text-sm border border-border/50 backdrop-blur-sm"
              >
                <span className="flex items-center space-x-2">
                  <span>{darkMode ? '☀️' : '🌙'}</span>
                  <span>{darkMode ? 'Light' : 'Dark'}</span>
                </span>
        </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span>WORKOUT CATEGORIES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black gradient-text">
            Choose Your Training
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your workout type and track your progress with precision analytics
          </p>
        </section>

        {/* Modern Workout Type Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(workoutTypes).map(([key, type]) => (
            <div
              key={key}
              className="group modern-card glass p-8 rounded-3xl border border-border/50 cursor-pointer relative overflow-hidden"
            >
              {/* Gradient overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl"
                style={{ background: `linear-gradient(135deg, ${type.color}40 0%, ${type.color}20 100%)` }}
              />
              
              <div className="relative z-10">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {type.label.toUpperCase()}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {type.description}
                </p>
                
                {/* Progress indicator */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    This Week
                  </span>
                  <div className="flex space-x-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full ${i < Math.floor(Math.random() * 7) ? 'bg-primary' : 'bg-muted'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Progress Analytics */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black gradient-text">Performance Analytics</h2>
            <p className="text-muted-foreground">Real-time insights into your training progress</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { percentage: 95, label: 'Excellent', color: getProgressColor(95), status: 'On Fire!' },
              { percentage: 80, label: 'Good', color: getProgressColor(80), status: 'Strong' },
              { percentage: 65, label: 'Average', color: getProgressColor(65), status: 'Steady' },
              { percentage: 45, label: 'Needs Work', color: getProgressColor(45), status: 'Focus' }
            ].map((item) => (
              <div key={item.percentage} className="modern-card glass p-6 rounded-2xl border border-border/50 text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full border-4 border-muted flex items-center justify-center relative overflow-hidden">
                    <div 
                      className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        background: `conic-gradient(${item.color} ${item.percentage * 3.6}deg, transparent 0deg)`,
                      }}
                    />
                    <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
                      <span className="workout-number text-lg font-bold">{item.percentage}%</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Weight Plate Colors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Weight Plates</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {[25, 20, 15, 10, 2.5].map((weight) => (
              <div
                key={weight}
                className="w-16 h-16 rounded-full border-4 border-gray-800 flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: getPlateColor(weight) }}
              >
                {weight}kg
              </div>
            ))}
          </div>
        </section>

        {/* Action Center */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-black gradient-text mb-4">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="modern-btn group p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl font-bold text-lg shadow-xl border-0">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl group-hover:scale-110 transition-transform">🚀</div>
                <span>START WORKOUT</span>
              </div>
            </button>
            
            <button className="modern-btn group p-6 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground rounded-2xl font-bold text-lg shadow-xl border-0">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl group-hover:scale-110 transition-transform">📊</div>
                <span>VIEW ANALYTICS</span>
              </div>
            </button>
            
            <button className="modern-btn group p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg shadow-xl border-0">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl group-hover:scale-110 transition-transform">🏆</div>
                <span>NEW RECORD</span>
              </div>
            </button>
            
            <button className="modern-btn group p-6 bg-gradient-to-br from-destructive to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl border-0">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl group-hover:scale-110 transition-transform">⏹️</div>
                <span>END SESSION</span>
              </div>
            </button>
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="modern-card glass p-8 rounded-3xl border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Today's Session</h3>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                  🔥
                </div>
                <div>
                  <p className="font-semibold">Push Day</p>
                  <p className="text-sm text-muted-foreground">Chest, Shoulders, Triceps</p>
                </div>
              </div>
              
              <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                {[
                  { exercise: 'Bench Press', sets: '3 × 8', weight: '225 lbs' },
                  { exercise: 'Shoulder Press', sets: '3 × 10', weight: '135 lbs' },
                  { exercise: 'Tricep Dips', sets: '3 × 12', weight: 'Bodyweight' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <span className="font-medium">{item.exercise}</span>
                    <div className="text-right">
                      <div className="workout-number text-sm font-bold">{item.sets}</div>
                      <div className="text-xs text-muted-foreground">{item.weight}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modern-card glass p-8 rounded-3xl border border-border/50">
            <h3 className="text-2xl font-bold mb-6">Weekly Progress</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">Workouts Completed</span>
                <div className="text-right">
                  <div className="workout-number text-3xl font-bold" style={{ color: getProgressColor(85) }}>
                    4<span className="text-lg text-muted-foreground">/5</span>
                  </div>
                  <div className="text-xs text-muted-foreground">This week</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { day: 'Mon', completed: true },
                  { day: 'Tue', completed: true },
                  { day: 'Wed', completed: false },
                  { day: 'Thu', completed: true },
                  { day: 'Fri', completed: true },
                  { day: 'Sat', completed: false },
                  { day: 'Sun', completed: false }
                ].map((day, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      day.completed 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {day.day}
                    </div>
                    <div className={`flex-1 h-2 rounded-full ${
                      day.completed ? 'bg-primary' : 'bg-muted'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Weight Plates Visualization */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-black gradient-text mb-4">Weight Plates</h2>
            <p className="text-muted-foreground">Standard Olympic weight plate colors</p>
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { weight: 25, color: getPlateColor(25), label: '25kg / 55lb' },
              { weight: 20, color: getPlateColor(20), label: '20kg / 45lb' },
              { weight: 15, color: getPlateColor(15), label: '15kg / 35lb' },
              { weight: 10, color: getPlateColor(10), label: '10kg / 25lb' },
              { weight: 2.5, color: getPlateColor(2.5), label: '2.5kg / 5lb' }
            ].map((plate) => (
              <div key={plate.weight} className="text-center group">
                <div 
                  className="w-20 h-20 rounded-full border-4 border-gray-800 flex items-center justify-center font-bold text-sm shadow-2xl group-hover:scale-110 transition-transform duration-300 modern-card"
                  style={{ backgroundColor: plate.color, color: plate.weight === 2.5 || plate.weight === 15 ? '#000' : '#fff' }}
                >
                  {plate.weight}kg
                </div>
                <p className="text-xs text-muted-foreground mt-2">{plate.label}</p>
              </div>
            ))}
          </div>
        </section>
        
        </main>
      </div>
    </div>
  )
}

export default App
