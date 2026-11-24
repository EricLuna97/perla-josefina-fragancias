using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.IO;

public class CatalogBatchCompositor
{
    private static Bitmap _logo;
    private static ImageCodecInfo _jpgEncoder;
    private static EncoderParameters _encParams;

    public static void Initialize(string logoPath)
    {
        _logo = (Bitmap)Image.FromFile(logoPath);
        foreach (var codec in ImageCodecInfo.GetImageDecoders())
        {
            if (codec.FormatID == ImageFormat.Jpeg.Guid)
            {
                _jpgEncoder = codec;
                break;
            }
        }
        _encParams = new EncoderParameters(1);
        _encParams.Param[0] = new EncoderParameter(Encoder.Quality, 94L);
    }

    public static void GenerateProductImage(
        string baseTemplatePath,
        string outPath,
        string categoryKey,
        string title,
        string subtitle)
    {
        using (Bitmap baseBmp = (Bitmap)Image.FromFile(baseTemplatePath))
        using (Bitmap result = new Bitmap(baseBmp.Width, baseBmp.Height))
        using (Graphics g = Graphics.FromImage(result))
        {
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;

            // 1. Dibujar el envase base virgen 100% limpio
            g.DrawImage(baseBmp, 0, 0, baseBmp.Width, baseBmp.Height);

            // 2. Coordenadas y formato de la etiqueta según categoría
            int labelW, labelH, labelX, labelY;
            float logoScale;
            float titleFontSize = 11.5f;

            switch (categoryKey)
            {
                case "CREMAS":
                case "SALES":
                    // Potes y frascos anchos
                    labelW = 340;
                    labelH = 210;
                    labelX = (baseBmp.Width - labelW) / 2;
                    labelY = 475;
                    logoScale = (labelW * 0.38f) / _logo.Width;
                    titleFontSize = title.Length > 25 ? 11f : 12.5f;
                    break;

                case "FRAGANCIAS":
                    // Frasco spray estilizado
                    labelW = 200;
                    labelH = 290;
                    labelX = (baseBmp.Width - labelW) / 2;
                    labelY = 480;
                    logoScale = (labelW * 0.55f) / _logo.Width;
                    titleFontSize = title.Length > 28 ? 10.5f : 11.5f;
                    break;

                case "CAPILAR":
                    // Botella shampoo
                    labelW = 190;
                    labelH = 280;
                    labelX = (baseBmp.Width - labelW) / 2;
                    labelY = 450;
                    logoScale = (labelW * 0.55f) / _logo.Width;
                    titleFontSize = title.Length > 28 ? 10.5f : 11.5f;
                    break;

                case "TINTURAS":
                case "ACEITES":
                default:
                    // Frasco gotero ámbar con tapa blanca
                    labelW = 228;
                    labelH = 295;
                    labelX = (baseBmp.Width - labelW) / 2;
                    labelY = 535;
                    logoScale = (labelW * 0.54f) / _logo.Width;
                    titleFontSize = title.Length > 28 ? 10.5f : 11.5f;
                    break;
            }

            Rectangle labelRect = new Rectangle(labelX, labelY, labelW, labelH);

            // 3. Etiqueta blanca de estudio con esquinas suaves y relieve
            using (GraphicsPath path = RoundedRect(labelRect, 8))
            {
                // Sombra de contacto suave
                Rectangle shadowRect = new Rectangle(labelX + 1, labelY + 2, labelW, labelH);
                using (GraphicsPath sPath = RoundedRect(shadowRect, 8))
                using (SolidBrush sBrush = new SolidBrush(Color.FromArgb(35, 0, 0, 0)))
                {
                    g.FillPath(sBrush, sPath);
                }

                // Fondo blanco puro con sutil degradé cilíndrico
                using (LinearGradientBrush bgBrush = new LinearGradientBrush(
                    labelRect,
                    Color.FromArgb(255, 255, 255),
                    Color.FromArgb(248, 246, 243),
                    LinearGradientMode.Horizontal))
                {
                    g.FillPath(bgBrush, path);
                }

                // Borde suave
                using (Pen p = new Pen(Color.FromArgb(218, 212, 202), 1.2f))
                {
                    g.DrawPath(p, path);
                }
            }

            // 4. Logo original de Josefina (Flor + caligrafía en magenta)
            int logoW = (int)(_logo.Width * logoScale);
            int logoH = (int)(_logo.Height * logoScale);
            int logoX = labelX + (labelW - logoW) / 2;
            int logoY = labelY + 14;

            g.DrawImage(_logo, new Rectangle(logoX, logoY, logoW, logoH));

            // 5. Línea divisoria magenta
            int lineY = logoY + logoH + 6;
            using (Pen divPen = new Pen(Color.FromArgb(160, 40, 90), 1.2f))
            {
                int margin = (int)(labelW * 0.20f);
                g.DrawLine(divPen, labelX + margin, lineY, labelX + labelW - margin, lineY);
            }

            // 6. Texto del Producto (Título y Subtítulo)
            int textY = lineY + 8;
            int textH = labelY + labelH - textY - 6;
            Rectangle textRect = new Rectangle(labelX + 8, textY, labelW - 16, textH);

            using (Font titleFont = new Font("Segoe UI", titleFontSize, FontStyle.Bold))
            using (Font subFont = new Font("Segoe UI", 8.5f, FontStyle.Regular))
            using (StringFormat sf = new StringFormat())
            {
                sf.Alignment = StringAlignment.Center;
                sf.LineAlignment = StringAlignment.Near;

                using (SolidBrush textBrush = new SolidBrush(Color.FromArgb(30, 30, 30)))
                {
                    g.DrawString(title.ToUpperInvariant(), titleFont, textBrush, textRect, sf);
                }

                if (!string.IsNullOrEmpty(subtitle))
                {
                    // Calcular altura que ocupó el título
                    SizeF titleSize = g.MeasureString(title.ToUpperInvariant(), titleFont, textRect.Width);
                    int subY = (int)(textRect.Y + titleSize.Height + 4);
                    Rectangle subRect = new Rectangle(textRect.X, subY, textRect.Width, textH - (subY - textY));

                    using (SolidBrush subBrush = new SolidBrush(Color.FromArgb(105, 105, 105)))
                    {
                        g.DrawString(subtitle, subFont, subBrush, subRect, sf);
                    }
                }
            }

            // Guardar producto final en disco
            string dir = Path.GetDirectoryName(outPath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            result.Save(outPath, _jpgEncoder, _encParams);
        }
    }

    private static GraphicsPath RoundedRect(Rectangle bounds, int radius)
    {
        int diameter = radius * 2;
        Size size = new Size(diameter, diameter);
        Rectangle arc = new Rectangle(bounds.Location, size);
        GraphicsPath path = new GraphicsPath();

        path.AddArc(arc, 180, 90);
        arc.X = bounds.Right - diameter;
        path.AddArc(arc, 270, 90);
        arc.Y = bounds.Bottom - diameter;
        path.AddArc(arc, 0, 90);
        arc.X = bounds.Left;
        path.AddArc(arc, 90, 90);

        path.CloseFigure();
        return path;
    }
}
