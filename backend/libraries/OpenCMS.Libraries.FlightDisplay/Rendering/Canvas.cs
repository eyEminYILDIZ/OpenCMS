namespace OpenCMS.Libraries.FlightDisplay.Rendering;

internal class Canvas
{
    public readonly int Width, Height;
    public readonly Cell[,] Cells;

    public Canvas(int w, int h)
    {
        Width = w;
        Height = h;
        Cells = new Cell[h, w];
    }

    public void SetCell(int r, int c, char ch, (byte, byte, byte) fg, (byte, byte, byte) bg)
    {
        if (r < 0 || r >= Height || c < 0 || c >= Width) return;
        Cells[r, c] = new Cell { Ch = ch, Fg = fg, Bg = bg };
    }

    public void FillRect(int r0, int c0, int rh, int cw, char ch, (byte, byte, byte) fg, (byte, byte, byte) bg)
    {
        for (int r = r0; r < r0 + rh; r++)
            for (int c = c0; c < c0 + cw; c++)
                SetCell(r, c, ch, fg, bg);
    }

    public void SetChar(int r, int c, char ch, (byte, byte, byte)? fg = null)
    {
        if (r < 0 || r >= Height || c < 0 || c >= Width) return;
        var cell = Cells[r, c];
        cell.Ch = ch;
        if (fg.HasValue) cell.Fg = fg.Value;
        Cells[r, c] = cell;
    }

    public void DrawText(int r, int c0, string text, (byte, byte, byte) fg, (byte, byte, byte)? bg = null)
    {
        for (int i = 0; i < text.Length; i++)
        {
            int c = c0 + i;
            if (c < 0 || c >= Width || r < 0 || r >= Height) continue;
            var cell = Cells[r, c];
            cell.Ch = text[i];
            cell.Fg = fg;
            if (bg.HasValue) cell.Bg = bg.Value;
            Cells[r, c] = cell;
        }
    }

    public void DrawTextCentered(int r, int centerCol, string text, (byte, byte, byte) fg, (byte, byte, byte)? bg = null)
        => DrawText(r, centerCol - text.Length / 2, text, fg, bg);

    public void Blit(Canvas src, int rowOffset, int colOffset)
    {
        for (int r = 0; r < src.Height; r++)
            for (int c = 0; c < src.Width; c++)
            {
                var cell = src.Cells[r, c];
                SetCell(rowOffset + r, colOffset + c, cell.Ch, cell.Fg, cell.Bg);
            }
    }

    public string ToAnsi()
    {
        var sb = new StringBuilder();
        (byte, byte, byte)? lastFg = null, lastBg = null;
        for (int r = 0; r < Height; r++)
        {
            for (int c = 0; c < Width; c++)
            {
                var cell = Cells[r, c];
                if (lastFg != cell.Fg)
                {
                    sb.Append("\x1b[38;2;").Append(cell.Fg.r).Append(';').Append(cell.Fg.g).Append(';').Append(cell.Fg.b).Append('m');
                    lastFg = cell.Fg;
                }
                if (lastBg != cell.Bg)
                {
                    sb.Append("\x1b[48;2;").Append(cell.Bg.r).Append(';').Append(cell.Bg.g).Append(';').Append(cell.Bg.b).Append('m');
                    lastBg = cell.Bg;
                }
                sb.Append(cell.Ch == '\0' ? ' ' : cell.Ch);
            }
            sb.Append("\x1b[0m\r\n");
            lastFg = null;
            lastBg = null;
        }
        return sb.ToString();
    }
}
