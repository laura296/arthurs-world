import { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getTheme } from '../data/sectionThemes';

const SectionContext = createContext(null);

export function SectionProvider({ children }) {
  const { section } = useParams();
  const theme = useMemo(() => getTheme(section), [section]);

  return (
    <SectionContext.Provider value={theme}>
      {children}
    </SectionContext.Provider>
  );
}

/** Use current section theme. Returns null when outside a section route. */
export function useSection() {
  return useContext(SectionContext);
}
