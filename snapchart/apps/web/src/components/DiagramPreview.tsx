import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Loader2, AlertCircle, FileText, CheckCircle, Copy, Download, Image } from 'lucide-react';

interface DiagramPreviewProps {
  data: any;
  isLoading: boolean;
  error: Error | null;
}

// Mermaid 초기화
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose'
});

export function DiagramPreview({ data, isLoading, error }: DiagramPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.code && containerRef.current) {
      renderDiagram(data.code);
    }
  }, [data]);

  const renderDiagram = async (code: string) => {
    if (!containerRef.current) return;

    try {
      const { svg } = await mermaid.render(`diagram-${Date.now()}`, code);
      containerRef.current.innerHTML = svg;
    } catch (error: any) {
      console.error('Mermaid render error:', error);
      containerRef.current.innerHTML = `
        <div class="text-red-600 text-center p-4">
          <p class="font-semibold">렌더링 오류</p>
          <p class="text-sm mt-2">${error.message}</p>
        </div>
      `;
    }
  };

  const copyCode = async () => {
    if (!data?.code) return;
    try {
      await navigator.clipboard.writeText(data.code);
      alert('코드가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const downloadSVG = async () => {
    if (!containerRef.current) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `diagram-${Date.now()}.svg`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadPNG = async () => {
    if (!containerRef.current) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    // SVG 크기 가져오기
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // 고해상도를 위해 2x 스케일
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;

      // 흰색 배경
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // SVG 그리기 (2x scale)
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);

      // PNG 다운로드
      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `diagram-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(pngUrl);
      });

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-700 font-medium">
            AI가 다이어그램을 생성하고 있습니다...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            평균 5초 소요
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px]">
        <div className="text-center text-red-600">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            생성 실패
          </h3>
          <p className="text-sm mb-4">
            {error.message || '알 수 없는 오류가 발생했습니다'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-[500px]">
        <div className="text-center text-gray-400">
          <FileText size={64} className="mx-auto mb-4" />
          <p>다이어그램을 생성해보세요</p>
          <p className="text-sm mt-2">
            자연어로 설명하면 AI가 자동으로 변환합니다
          </p>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-600" size={20} />
          <span className="font-medium">생성 완료</span>
          {data.cached && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              캐시됨
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {data.duration}ms
          </span>
          <span className="text-xs text-gray-400">
            ({data.provider})
          </span>

          <button
            onClick={downloadPNG}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="PNG 다운로드"
          >
            <Image size={20} />
          </button>

          <button
            onClick={downloadSVG}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="SVG 다운로드"
          >
            <Download size={20} />
          </button>

          <button
            onClick={copyCode}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="코드 복사"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>

      {/* Diagram */}
      <div
        ref={containerRef}
        className="border border-gray-200 rounded-lg p-4 overflow-auto bg-white min-h-[400px] flex items-center justify-center"
      />

      {/* Code view */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium">
          Mermaid 코드 보기
        </summary>
        <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-x-auto border border-gray-200">
          <code>{data.code}</code>
        </pre>
      </details>
    </div>
  );
}
