import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFormContext } from './Form';

interface DatePickerProps<T extends Record<string, unknown> = Record<string, unknown>> {
    name: keyof T & string;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toIsoLocal(year: number, month: number, day: number): string {
    const y = String(year);
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}T00:00:00`;
}

function parseLocalDate(iso: string): Date | null {
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function formatDisplay(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function DatePicker<T extends Record<string, unknown> = Record<string, unknown>>({ name }: DatePickerProps<T>) {
    const { values, setFieldValue } = useFormContext();
    const { t } = useTranslation();

    const rawValue = values[name] as string | undefined;
    const selectedDate = rawValue ? parseLocalDate(rawValue) : null;

    const today = new Date();
    const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());
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
        setFieldValue(name, toIsoLocal(viewYear, viewMonth, day));
        setOpen(false);
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
        !!selectedDate &&
        selectedDate.getFullYear() === viewYear &&
        selectedDate.getMonth() === viewMonth &&
        selectedDate.getDate() === day;

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
                {selectedDate ? (
                    <span>{formatDisplay(selectedDate)}</span>
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
                </div>
            )}
        </div>
    );
}

export default DatePicker;
