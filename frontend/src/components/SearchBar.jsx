import { useState, useRef, useEffect } from "react"

function SearchBar({ allSymbols, onSelectStock }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!val.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      const q = val.toUpperCase()
      const matches = allSymbols
        .filter(
          (s) =>
            s.symbol.includes(q) ||
            s.companyName.toUpperCase().includes(q)
        )
        .slice(0, 10)
      setResults(matches)
      setShowDropdown(true)
    }, 300)
  }

  const handleSelect = (stock) => {
    setQuery(stock.symbol)
    setShowDropdown(false)
    if (onSelectStock) onSelectStock(stock)
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          id="stock-search-bar"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Search stocks by symbol or company..."
          className=" w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm text-gray-900 bg-white"
        />
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((s) => (
            <li
              key={s.symbol}
              onClick={() => handleSelect(s)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center text-sm border-b border-gray-50 last:border-0"
            >
              <span>
                <span className="font-semibold text-gray-800">{s.symbol}</span>
                <span className="text-gray-500 ml-2">{s.companyName}</span>
              </span>
              <span className="text-gray-400 text-xs">→</span>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && query.trim() && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-400">
          No stocks found for "{query}"
        </div>
      )}
    </div>
  )
}

export default SearchBar
