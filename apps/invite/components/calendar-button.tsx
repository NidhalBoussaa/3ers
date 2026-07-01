"use client";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "./reveal";
import { pick } from "@/lib/schema";

function fmt(iso: string) {
  return iso.replace(/[-:]/g, "").replace(/\.\d+/, "").slice(0, 15);
}

export function CalendarAndDirections() {
  const { config, t } = useI18n();

  const ics = useMemo(() => {
    const c = config.couple;
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding//Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${c.monogram.replace(/\W/g, "")}-${new Date(config.date.iso).getFullYear()}@wedding`,
      `DTSTAMP:${fmt(config.date.iso)}`,
      `DTSTART:${fmt(config.date.iso)}`,
      `DTEND:${fmt(config.date.endIso)}`,
      `SUMMARY:Mariage ${c.groom.first} & ${c.bride.first}`,
      `LOCATION:${pick(config.venue.name, "fr")}, ${pick(config.venue.city, "fr")}`,
      `DESCRIPTION:${pick(config.i18n.labels.inviteLead, "fr")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  }, [config]);

  // Build the blob URL only after mount so SSR and first client render match ("#").
  const [icsHref, setIcsHref] = useState("#");
  useEffect(() => {
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    setIcsHref(url);
    return () => URL.revokeObjectURL(url);
  }, [ics]);

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.venue.mapsQuery)}`;

  return (
    <Reveal variant="bloom" stagger className="flex flex-wrap justify-center gap-2">
      {config.features.calendar && (
        <a
          className="btn-gold inline-flex items-center gap-2"
          href={icsHref}
          download={`mariage-${config.couple.groom.first}-${config.couple.bride.first}.ics`.toLowerCase()}
        >
          <CalIcon /> <span>{t(config.i18n.labels.addToCalendar)}</span>
        </a>
      )}
      <a
        className="btn-gold inline-flex items-center gap-2"
        href={mapUrl}
        target="_blank"
        rel="noopener"
      >
        <PinIcon /> <span>{t(config.i18n.labels.directions)}</span>
      </a>
    </Reveal>
  );
}

function CalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 stroke-current fill-none" strokeWidth={1.6} aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 stroke-current fill-none" strokeWidth={1.6} aria-hidden="true">
      <path d="M12 2c-3.9 0-7 3-7 6.9 0 5 7 12.1 7 12.1s7-7.1 7-12.1C19 5 15.9 2 12 2z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}
