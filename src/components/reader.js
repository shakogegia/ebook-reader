import { useCallback, useEffect, useState, Fragment, useMemo, useRef } from "react";

const hashLineregex = /^#+$/;

const BOX_WIDTH = 500;
const BOX_HEIGHT = 600;

const PADDING = 20;
const BORDER = 2;

const VIEWPORT_HEIGHT = BOX_HEIGHT - PADDING*2 - BORDER

export default function Reader(params) {
  const [isReady, setIsReady] = useState(false)
  const contentRef = useRef(null)

  const [content, setContent] = useState([])

  const [pageBreaks, setPageBreaks] = useState([])
  
  const sortedPageBreaks = useMemo(() => pageBreaks.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })), [pageBreaks])
  
  const [currenPageIndex, setCurrentPageIndex] = useState(0)
  const [currenPageData, setCurrentPageData] = useState([])

  const parse = useCallback(() => {
    // split content into lines
    const lines = params.content.split('\n');

    // remove empty lines and trim
    const linesArray = lines.filter((line) => line.trim() !== '' && line.trim() !== '.').map((line) => line.trim());

    const result = [];
    let previousLine = '';
    
    linesArray.forEach((line, index) => {
      // if line is a just a hash, skip it
      if (!hashLineregex.test(line)) {

          const words = line.split(' ')

          // basic style is body
          let style = 'body';

          // check if line is a heading
          if (previousLine === '#'
              && linesArray[index + 1] === '##'
              && linesArray[index + 2] === '###'
              && linesArray[index + 3] === '####') {
              style = 'heading';
          }
          
          result.push({ words, style: style });
      }
      previousLine = line;
    });

    setContent(result);
  }, [params.content])
  
  useEffect(() => {
    pageBreaks.length * VIEWPORT_HEIGHT > BOX_HEIGHT && setIsReady(true)
  }, [pageBreaks.length])
  
  useEffect(() => {
    parse()
  }, [parse])
  
  useEffect(() => {
    if(content.length && sortedPageBreaks.length && isReady) {
      function filterContent(arr, start, end) {
        const [startLineIndex, startWordIndex] = start.split('-').map(Number)
        const [endLineIndex, endWordIndex] = end?.split('-').map(Number) || [ content.length-1, content[content.length-1].words.length-1 ]
        
        // Filter the array
        return arr.reduce((acc, curr, lineIndex) => {
            // Check if the current line is within the range
            if (lineIndex >= startLineIndex && lineIndex <= endLineIndex) {
                let words;
    
                if (lineIndex === startLineIndex && lineIndex === endLineIndex) {
                    // If the start and end lines are the same
                    words = curr.words.slice(startWordIndex, endWordIndex+1);
                } else if (lineIndex === startLineIndex) {
                    // If it's the start line
                    words = curr.words.slice(startWordIndex);
                } else if (lineIndex === endLineIndex) {
                    // If it's the end line
                    words = curr.words.slice(0, endWordIndex);
                } else {
                    // If it's in between the start and end lines
                    words = curr.words;
                }
    
                // Add the object to the accumulator if it has words
                if (words.length > 0) {
                    acc.push({ ...curr, words });
                }
            }
    
            return acc;
        }, []);
      }

      setCurrentPageData(filterContent(content, sortedPageBreaks[currenPageIndex], sortedPageBreaks[currenPageIndex+1]))
    }
  }, [content, currenPageIndex, isReady, pageBreaks, sortedPageBreaks])

  const onPageBreak = useCallback(({ lineIndex, wordIndex }) => {
    setPageBreaks((prevState) => {
      const pageBreak = `${lineIndex}-${wordIndex}`
      if (prevState.includes(pageBreak)) return prevState
      return [...prevState, pageBreak]
    })
  }, []) 

  return (
    <div className="flex items-center gap-4">
      <button
        className="disabled:opacity-50 flex items-center gap-2 hover:opacity-75"
        onClick={() => setCurrentPageIndex((prevState) => prevState-1)}
        disabled={currenPageIndex === 0}
      >
        <PrevIcon />
        <span>Prev</span>
      </button>

      <div className="flex flex-col gap-2">
        <div className='w-[400px] border border-dashed rounded-lg relative font-serif' style={{ background: '#faebd785', width: `${BOX_WIDTH}px`, height: `${BOX_HEIGHT}px`, padding: `${PADDING}px` }}>
          {!isReady && <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"> Loading... </div>}

          {!isReady && <div ref={contentRef} className="w-full relative" style={{ wordWrap: 'break-word', opacity: 0 }}>
            {content.map((line, lineIndex) => {
              return <p key={`line-${lineIndex}`} className={line.style === 'heading' ? 'text-3xl text-center mb-8' : ''}>
                  {line.words.map((word, wordIndex) => (
                    <Fragment key={`word-${lineIndex+wordIndex}`}>
                      <Word
                        lineIndex={lineIndex}
                        wordIndex={wordIndex}
                        onPageBreak={onPageBreak}
                      >
                        {word}
                      </Word>

                      {/* Draw empty space between words, if not last word */}
                      {line.words[wordIndex+1] && ' '}
                    </Fragment>
                  ))}
                </p>
            })}
          </div>}

          {isReady && (
            <div className="w-full relative" style={{ wordWrap: 'break-word' }}>
              {currenPageData.map((line, lineIndex) => {
                return (
                  <div key={`line-${lineIndex}`}>
                    <p className={line.style === 'heading' ? 'text-3xl text-center mb-8' : ''}>
                      {line.words.map((word, wordIndex) => (
                        <Fragment key={`word-${lineIndex+wordIndex}`}>
                          <span>{word}</span>

                          {/* Draw empty space between words, if not last word */}
                          {line.words[wordIndex+1] && ' '}
                        </Fragment>
                      ))}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
          
        </div>
        <div className="text-center">
          <span>Page {currenPageIndex+1} of {sortedPageBreaks.length}</span>
        </div>
      </div>

      <button 
        className="disabled:opacity-50 flex items-center gap-2 hover:opacity-75"
        onClick={() => setCurrentPageIndex((prevState) => prevState+1)} 
        disabled={currenPageIndex === sortedPageBreaks.length-1}
      >
        <span>Next</span>
        <NextIcon />
      </button>
    </div>
  )
}

function Word({ children, lineIndex, wordIndex, onPageBreak }) {
  const [isNewLine, setIsNewLine] = useState(false)
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      const { offsetLeft, offsetTop, offsetHeight } = ref.current;
      const isFirstWord = lineIndex === 0 && wordIndex === 0
      const pageSequence = parseInt(offsetTop / VIEWPORT_HEIGHT)+1
      const pageBottomPoint = pageSequence * VIEWPORT_HEIGHT
      const wordBottomPoint = offsetTop + offsetHeight
      const isOnNewLine = offsetLeft === 0 && offsetTop !== 0 && (wordBottomPoint > pageBottomPoint || pageBottomPoint - wordBottomPoint <= 5)
      
      if(children === 'anders' && offsetTop === 2211) {
        console.log({ pageBottomPoint, wordBottomPoint, offsetTop, offsetHeight, reminder: wordBottomPoint % VIEWPORT_HEIGHT, x: (pageBottomPoint - wordBottomPoint) + (wordBottomPoint % 558)})
      }

      if (isFirstWord || isOnNewLine) {
        onPageBreak({ lineIndex, wordIndex })
        setIsNewLine(true)
      }
    }
  }, []);
  
  return <span ref={ref} style={{ backgroundColor: isNewLine ? 'red' : 'transparent'
   }}>{children}</span>
}

function PrevIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}