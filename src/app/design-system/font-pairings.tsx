import { useEffect, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '../components/ui/button';
import { cn } from '../components/ui/utils';
import { fontOptions } from './fontOptions';
import '../../styles/index.css';
import './font-proposals.css';

function FontPairings() {
  const [fontStatus, setFontStatus] = useState<Record<string, string>>({});
  useEffect(() => {
    for (const font of fontOptions) {
      void Promise.all([400, 500, 600, 650].map(weight => document.fonts.load(`${weight} 16px "${font.family}"`, 'ҐґЄєІіЇї₴€0123456789')))
        .then(faces => setFontStatus(previous => ({ ...previous, [font.id]: faces.every(list => list.length > 0) ? 'Локальний шрифт завантажено' : 'Шрифт не завантажився' })))
        .catch(() => setFontStatus(previous => ({ ...previous, [font.id]: 'Шрифт не завантажився' })));
    }
  }, []);
  const [profile, setProfile] = useState<'personal' | 'business'>('personal');
  const [screen, setScreen] = useState('payments');
  const [revision, setRevision] = useState(0);
  return <main data-font-pairings className="mx-auto max-w-screen-2xl space-y-8 p-4 sm:p-8">
    <header className="space-y-3">
      <p className="text-sm text-muted-foreground">Zapad Banka · Типографічна пропозиція</p>
      <h1 className="text-2xl">Unbounded + новий UI-шрифт</h1>
      <p className="max-w-3xl text-base">Unbounded залишається в заголовках. Порівняйте три безкоштовні заміни Inter для текстів, сум і кнопок на однакових живих екранах.</p>
      <p className="text-sm text-muted-foreground">Усі варіанти мають українську кирилицю та ліцензію SIL OFL 1.1. Це окремі демонстрації з даними в пам’яті.</p>
    </header>
    <div className="flex flex-wrap items-center gap-4">
      <div role="group" aria-label="Профіль" className="flex gap-2">
        {(['personal', 'business'] as const).map(value => <Button key={value} variant={profile === value ? 'default' : 'outline'} aria-pressed={profile === value} onClick={() => setProfile(value)}>{value === 'personal' ? 'Personal' : 'Business'}</Button>)}
      </div>
      <div role="group" aria-label="Екран" className="flex flex-wrap gap-2">
        {[['home', 'Головна'], ['payments', 'Платежі'], ['transactions', 'Операції']].map(([value, label]) => <Button key={value} variant="outline" aria-pressed={screen === value} className={cn(screen === value && 'bg-secondary')} onClick={() => setScreen(value)}>{label}</Button>)}
      </div>
      <Button variant="ghost" onClick={() => setRevision(value => value + 1)}>Скинути приклади</Button>
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {fontOptions.map((font, index) => {
        const url = `/design-system-preview.html?sample=app-layout&state=${screen}&context=${profile}&bodyfont=${font.id}&locale=uk`;
        const style = { '--bank-body': `"${font.family}", sans-serif`, fontFamily: `"${font.family}", sans-serif` } as CSSProperties;
        return <section key={font.id} aria-labelledby={`font-${font.id}`} className="min-w-0 space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">ВАРІАНТ {index + 1} · {index === 0 ? 'РЕКОМЕНДАЦІЯ' : 'АЛЬТЕРНАТИВА'}</p>
            <h2 id={`font-${font.id}`} className="text-xl font-semibold">Unbounded + {font.name}</h2>
            <p className="text-sm">{font.note}</p>
            <p className="text-sm text-muted-foreground">{font.tradeoff}</p>
            <p role="status" className="text-xs text-muted-foreground">{fontStatus[font.id] ?? 'Завантаження шрифту…'}</p>
          </div>
          <div data-font-specimen style={style} className="space-y-3 rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">{font.name} · 16 px · 400 / 500 / 600 / 650</p>
            <p className="text-base">Переказуйте кошти зручно й безпечно</p>
            <p className="text-base font-medium">Ґґ Єє Іі Її · 0О 1Іl · Україна</p>
            <p className="text-xl font-semibold tabular-nums">12 345,67 ₴ · 8 920,00 €</p>
          </div>
          <iframe key={`${profile}-${screen}-${revision}`} title={`${font.name} — ${profile}`} src={url} sandbox="allow-scripts allow-same-origin allow-downloads" className="h-gallery-preview w-full rounded-xl border bg-card" />
          <div className="flex flex-wrap gap-4 text-sm">
            <a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-4">Відкрити екран окремо ↗</a>
            <a href={font.source} target="_blank" rel="noreferrer" className="underline underline-offset-4">Шрифт і ліцензія ↗</a>
          </div>
        </section>;
      })}
    </div>
    <footer className="space-y-2 border-t pt-6 text-sm text-muted-foreground">
      <p>Рекомендована система: Unbounded 500 — заголовки; Onest 400 — текст; 500 — підписи; 600 — суми; 650 — кнопки. Типографіка: H1–H6 40/32/28/24/20/16 px; основний текст 16/24 px. Кольори профілів збережено.</p>
      <p>Попапи можна відкривати всередині кожного прикладу. Onest уже застосовано в Personal та Business. Ілюстративний прототип без реальних банківських операцій.</p>
    </footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<FontPairings/>);
