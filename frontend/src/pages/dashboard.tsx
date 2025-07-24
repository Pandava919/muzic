import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Music, Plus, Play, Pause, SkipForward, SkipBack, Volume2, Heart } from "lucide-react"
import axios from "axios"
// import Image from "next/image"

interface Song {
  id: string
  title: string
  artist: string
  caption: string
  imageUrl: string
  videoUrl: string
  upvotes: number
  downvotes: number
  userVote?: "up" | "down" | null
  duration: string
}

export default function Dashboard() {
  const [url, setUrl] = useState("")
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [songs, setSongs] = useState<Song[]>([
    {
      id: "1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      caption: "A rock opera masterpiece that defined a generation",
      imageUrl: "/placeholder.svg?height=300&width=300",
      videoUrl: "https://youtube.com/watch?v=fJ9rUzIMcZQ",
      upvotes: 142,
      downvotes: 8,
      userVote: null,
      duration: "5:55",
    },
    {
      id: "2",
      title: "Blinding Lights",
      artist: "The Weeknd",
      caption: "Synth-pop hit that dominated the charts worldwide",
      imageUrl: "/placeholder.svg?height=300&width=300",
      videoUrl: "https://youtube.com/watch?v=4NRXx6U8ABQ",
      upvotes: 89,
      downvotes: 12,
      userVote: "up",
      duration: "3:20",
    },
    {
      id: "3",
      title: "Shape of You",
      artist: "Ed Sheeran",
      caption: "Catchy pop anthem with tropical house influences",
      imageUrl: "/placeholder.svg?height=300&width=300",
      videoUrl: "https://youtube.com/watch?v=JGwWNGJdvx8",
      upvotes: 76,
      downvotes: 15,
      userVote: null,
      duration: "3:53",
    },
    {
      id: "4",
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      caption: "Sweet summer vibes with retro pop elements",
      imageUrl: "/placeholder.svg?height=300&width=300",
      videoUrl: "https://youtube.com/watch?v=E07s5ZYygMg",
      upvotes: 64,
      downvotes: 7,
      userVote: null,
      duration: "2:54",
    },
  ])

  const handleAddSong = async() => {
    if (!url.trim()) return

    await axios.post('http://localhost:8080/streams',{
        url
    }, {
        withCredentials: true
    })
    const { data } = await axios.get('http://localhost:8080/streams', {
        withCredentials: true
    })


  

    setSongs([data, ...songs])
    setUrl("")
  }

  const handleVote = (songId: string, voteType: "up" | "down") => {
    setSongs(
      songs.map((song) => {
        if (song.id !== songId) return song

        const newSong = { ...song }

        if (song.userVote === "up") {
          newSong.upvotes -= 1
        } else if (song.userVote === "down") {
          newSong.downvotes -= 1
        }

        if (song.userVote !== voteType) {
          if (voteType === "up") {
            newSong.upvotes += 1
          } else {
            newSong.downvotes += 1
          }
          newSong.userVote = voteType
        } else {
          newSong.userVote = null
        }

        return newSong
      }),
    )
  }

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const handleNextSong = () => {
    if (!currentSong) return
    const currentIndex = sortedSongs.findIndex((song) => song.id === currentSong.id)
    const nextIndex = (currentIndex + 1) % sortedSongs.length
    setCurrentSong(sortedSongs[nextIndex])
  }

  const handlePrevSong = () => {
    if (!currentSong) return
    const currentIndex = sortedSongs.findIndex((song) => song.id === currentSong.id)
    const prevIndex = currentIndex === 0 ? sortedSongs.length - 1 : currentIndex - 1
    setCurrentSong(sortedSongs[prevIndex])
  }

  const sortedSongs = [...songs].sort((a, b) => b.upvotes - a.upvotes)

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-2">
      <div className="flex h-screen">
        {/* Left Side - Songs List */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Music className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold">Music Library</h1>
            </div>
            <p className="text-gray-400 text-sm">{songs.length} songs • Sorted by upvotes</p>
          </div>

          {/* Songs List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sortedSongs.map((song, index) => (
              <Card
                key={song.id}
                className={`bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all cursor-pointer ${
                  currentSong?.id === song.id ? "ring-2 ring-purple-500 bg-gray-750" : ""
                }`}
                onClick={() => handlePlaySong(song)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-8 text-center">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    </div>

                    {/* Album Art */}
                    <div className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden">
                      {/* <Image src={song.imageUrl || "/placeholder.svg"} alt={song.title} fill className="object-cover" /> */}
                      {currentSong?.id === song.id && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          {isPlaying ? (
                            <Pause className="h-6 w-6 text-white" />
                          ) : (
                            <Play className="h-6 w-6 text-white" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{song.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-1">{song.caption}</p>
                    </div>

                    {/* Duration */}
                    {/* <div className="text-gray-400 text-sm">{song.duration}</div> */}

                    {/* Voting */}
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVote(song.id, "up")
                        }}
                        className={`p-1 h-7 w-7 ${
                          song.userVote === "up"
                            ? "text-green-400 bg-green-400/20"
                            : "text-gray-400 hover:text-green-400"
                        }`}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <span className="text-xs font-medium text-green-400">{song.upvotes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVote(song.id, "down")
                        }}
                        className={`p-1 h-7 w-7 ${
                          song.userVote === "down" ? "text-red-400 bg-red-400/20" : "text-gray-400 hover:text-red-400"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side - Input and Player */}
        <div className="w-1/2 flex flex-col">
          {/* Add Song Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold">Add New Song</h2>
            </div>
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="Paste song or video URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddSong()
                  }
                }}
              />
              <Button onClick={handleAddSong} className="bg-purple-600 hover:bg-purple-700">
                Add
              </Button>
            </div>
          </div>

          {/* Music Player */}
          <div className="flex-1 flex flex-col">
            {currentSong ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                {/* Album Art */}
                <div className="w-80 h-80 relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
                  <Image
                    src={currentSong.imageUrl || "/placeholder.svg"}
                    alt={currentSong.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Song Info */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">{currentSong.title}</h2>
                  <p className="text-xl text-gray-400 mb-2">{currentSong.artist}</p>
                  <p className="text-gray-500 max-w-md">{currentSong.caption}</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-400">1:23</span>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full">
                      <div className="w-1/3 h-full bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-400">{currentSong.duration}</span>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="flex items-center gap-6 mb-8">
                  <Button variant="ghost" size="lg" onClick={handlePrevSong} className="text-gray-400 hover:text-white">
                    <SkipBack className="h-6 w-6" />
                  </Button>

                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-purple-600 hover:bg-purple-700 rounded-full w-16 h-16"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                  </Button>

                  <Button variant="ghost" size="lg" onClick={handleNextSong} className="text-gray-400 hover:text-white">
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>

                {/* Additional Controls */}
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-gray-400" />
                    <div className="w-20 h-1 bg-gray-700 rounded-full">
                      <div className="w-3/4 h-full bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Music className="h-16 w-16 text-gray-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No song selected</h3>
                <p className="text-gray-400 mb-6">Choose a song from the library to start playing</p>
                <Button
                  onClick={() => sortedSongs.length > 0 && handlePlaySong(sortedSongs[0])}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={songs.length === 0}
                >
                  Play First Song
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
