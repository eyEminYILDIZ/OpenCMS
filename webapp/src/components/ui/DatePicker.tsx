import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFormContext } from './Form';

interface DatePickerProps<T extends Record<string, unknown> = Record<string, unknown>> {
    name: keyof T & string;
    mode?: 'date' | 'datetime';
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function pad(n: number): string {
    return String(n).padStart(2, '0');
}

function toIsoLocal(year: number, month: number, day: number, hour: number, minute: number): string {
    return `${year}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`;
}

interface ParsedDateTime {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
}

function parseIso(iso: string): ParsedDateTime | null {
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
    if (!match) return null;
    return {
        year: Number(match[1]),
        month: Number(match[2]) - 1,
        day: Number(match[3]),
        hour: Number(match[4] ?? 0),
        minute: Number(match[5] ?? 0),
    };
}

function formatDisplay(dt: ParsedDateTime, mode: 'date' | 'datetime'): string {
    const date = new Date(dt.year, dt.month, dt.day);
    const datePart = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    if (mode === 'date') return datePart;
    return `${datePart} ${pad(dt.hour)}:${pad(dt.minute)}`;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function DatePicker<T extends Record<string, unknown> = Record<string, unknown>>({
    name,
    mode = 'date',
}: DatePickerProps<T>) {
    const { values, setFieldValue } = useFormContext();
    const { t } = useTranslation();

    const rawValue = values[name] as string | undefined;
    const parsed = rawValue ? parseIso(rawValue) : null;

    const today = new Date();
    const [viewYear, setViewYear] = useState(parsed?.year ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth());
    const [open, setOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onMouseDown = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, [open]);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };

    const handleSelectDay = (day: number) => {
        const hour = parsed?.hour ?? 0;
        const minute = parsed?.minute ?? 0;
        setFieldValue(name, toIsoLocal(viewYear, viewMonth, day, hour, minute));
        if (mode === 'date') setOpen(false);
    };

    const handleHourChange = (raw: string) => {
        if (!parsed) return;
        const hour = clamp(Number(raw), 0, 23);
        setFieldValue(name, toIsoLocal(parsed.year, parsed.month, parsed.day, hour, parsed.minute));
    };

    const handleMinuteChange = (raw: string) => {
        if (!parsed) return;
        const minute = clamp(Number(raw), 0, 59);
        setFieldValue(name, toIsoLocal(parsed.year, parsed.month, parsed.day, parsed.hour, minute));
    };

    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    type Cell = { day: number; kind: 'prev' | 'current' | 'next' };
    const cells: Cell[] = [];

    for (let i = firstWeekday - 1; i >= 0; i--) {
        cells.push({ day: daysInPrevMonth - i, kind: 'prev' });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, kind: 'current' });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
        cells.push({ day: d, kind: 'next' });
    }

    const isSelected = (day: number) =>
        !!parsed &&
        parsed.year === viewYear &&
        parsed.month === viewMonth &&
        parsed.day === day;

    const isToday = (day: number) =>
        today.getFullYear() === viewYear &&
        today.getMonth() === viewMonth &&
        today.getDate() === day;

    return (
        <div className="datepicker" ref={containerRef}>
            <button
                type="button"
                className="datepicker-trigger"
                onClick={() => setOpen(o => !o)}
            >
                {parsed ? (
                    <span>{formatDisplay(parsed, mode)}</span>
                ) : (
                    <span className="datepicker-placeholder">{t('common.datePicker.placeholder')}</span>
                )}
                <CalendarIcon size={14} className="datepicker-icon" />
            </button>

            {open && (
                <div className="datepicker-popover">
                    <div className="datepicker-header">
                        <button type="button" className="datepicker-nav-btn" onClick={prevMonth}>
                            <ChevronLeft size={14} />
                        </button>
                        <span className="datepicker-month-label">
                            {MONTH_NAMES[viewMonth]} {viewYear}
                        </span>
                        <button type="button" className="datepicker-nav-btn" onClick={nextMonth}>
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="datepicker-grid">
                        {WEEKDAYS.map(wd => (
                            <div key={wd} className="datepicker-weekday">{wd}</div>
                        ))}
                        {cells.map((cell, i) => (
                            <button
                                key={i}
                                type="button"
                                disabled={cell.kind !== 'current'}
                                className={[
                                    'datepicker-day',
                                    cell.kind !== 'current' ? 'datepicker-day--outside' : '',
                                    cell.kind === 'current' && isSelected(cell.day) ? 'datepicker-day--selected' : '',
                                    cell.kind === 'current' && !isSelected(cell.day) && isToday(cell.day) ? 'datepicker-day--today' : '',
                                ].filter(Boolean).join(' ')}
                                onClick={() => handleSelectDay(cell.day)}
                            >
                                {cell.day}
                            </button>
                        ))}
                    </div>

                    {mode === 'datetime' && (
                        <div className="datepicker-time">
                            <span className="datepicker-time-label">{t('common.datePicker.time')}</span>
                            <div className="datepicker-time-inputs">
                                <input
                                    type="number"
                                    className="datepicker-time-input"
                                    min={0}
                                    max={23}
                                    value={pad(parsed?.hour ?? 0)}
                                    disabled={!parsed}
                                    onChange={e => handleHourChange(e.target.value)}
                                />
                                <span className="datepicker-time-sep">:</span>
                                <input
                                    type="number"
                                    className="datepicker-time-input"
                                    min={0}
                                    max={59}
                                    value={pad(parsed?.minute ?? 0)}
                                    disabled={!parsed}
                                    onChange={e => handleMinuteChange(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DatePicker;
