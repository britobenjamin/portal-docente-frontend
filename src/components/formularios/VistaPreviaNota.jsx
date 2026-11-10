// Vista previa HTML de la nota con el mismo formato que el PDF (hoja A4, márgenes, sangría, firma).

function Linea({ segs }) {
  return segs.map((s, i) => (s.bold ? <strong key={i}>{s.text}</strong> : <span key={i}>{s.text}</span>));
}

export default function VistaPreviaNota({ nota }) {
  return (
    <div className="mx-auto w-full max-w-[640px] rounded-sm border border-neutral-300 bg-white shadow-lg [container-type:inline-size]">
      {/* Proporción A4 (210x297), márgenes 3/2.5 cm y letra 12pt escalados al ancho de la hoja (cqw) */}
      <div className="aspect-[210/297] pb-[11.9%] pl-[14.3%] pr-[11.9%] pt-[11.9%] font-[Roboto,Arial,sans-serif] leading-normal text-black [font-size:2.02cqw]">
        {nota.lugarFecha && (
          <p className="mb-[3.2em] text-right">
            <Linea segs={nota.lugarFecha} />
          </p>
        )}
        {nota.destinatario.length > 0 && (
          <div className="mb-[2.4em]">
            {nota.destinatario.map((l, i) => (
              <p key={i} className="mb-[0.4em]">
                <Linea segs={l} />
              </p>
            ))}
          </div>
        )}
        {nota.parrafos.map((p, i) => (
          <p key={i} className="mb-[0.8em] whitespace-pre-line text-justify indent-[4.5em] leading-[1.5]">
            <Linea segs={p} />
          </p>
        ))}
        {nota.firma.length > 0 && (
          <div className="ml-auto mt-[4.5em] w-[45%] border-t border-black pt-[0.4em] text-center text-[0.92em]">
            {nota.firma.map((l, i) => (
              <p key={i}>
                <Linea segs={l} />
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
