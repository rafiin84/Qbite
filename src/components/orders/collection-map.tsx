import { ArrowSquareOut, MapPin } from "@phosphor-icons/react/dist/ssr";

interface CollectionMapProps {
  canteenName: string;
  location: string;
  coordinates: { lat: number; lng: number };
}

const PIN_OFFSET = 0.004;

export function CollectionMap({ canteenName, location, coordinates }: CollectionMapProps) {
  const { lat, lng } = coordinates;
  const bbox = [lng - PIN_OFFSET, lat - PIN_OFFSET, lng + PIN_OFFSET, lat + PIN_OFFSET].join(",");
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-[16/9] w-full bg-muted">
        <iframe
          title={`Map showing ${canteenName}`}
          src={embedSrc}
          className="size-full border-0"
          loading="lazy"
          aria-label={`Map centered on ${canteenName}, ${location}`}
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span>
            Collect from <span className="font-medium text-foreground">{canteenName}</span>, {location}
          </span>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          Directions
          <ArrowSquareOut className="size-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
