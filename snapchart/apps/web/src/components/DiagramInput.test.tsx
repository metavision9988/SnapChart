import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiagramInput } from './DiagramInput';

describe('DiagramInput', () => {
  const mockProps = {
    type: 'flowchart',
    prompt: '',
    onTypeChange: vi.fn(),
    onPromptChange: vi.fn(),
    onGenerate: vi.fn(),
    isLoading: false
  };

  it('should render diagram type selector', () => {
    render(<DiagramInput {...mockProps} />);
    const select = screen.getByLabelText('다이어그램 타입');
    expect(select).toBeInTheDocument();
  });

  it('should render textarea for prompt input', () => {
    render(<DiagramInput {...mockProps} />);
    const textarea = screen.getByLabelText('설명을 입력하세요');
    expect(textarea).toBeInTheDocument();
  });

  it('should render generate button', () => {
    render(<DiagramInput {...mockProps} />);
    const button = screen.getByText('다이어그램 생성');
    expect(button).toBeInTheDocument();
  });

  it('should call onTypeChange when diagram type changes', () => {
    const onTypeChange = vi.fn();
    render(<DiagramInput {...mockProps} onTypeChange={onTypeChange} />);

    const select = screen.getByLabelText('다이어그램 타입');
    fireEvent.change(select, { target: { value: 'sequence' } });

    expect(onTypeChange).toHaveBeenCalledWith('sequence');
  });

  it('should call onPromptChange when textarea changes', () => {
    const onPromptChange = vi.fn();
    render(<DiagramInput {...mockProps} onPromptChange={onPromptChange} />);

    const textarea = screen.getByLabelText('설명을 입력하세요');
    fireEvent.change(textarea, { target: { value: 'test prompt' } });

    expect(onPromptChange).toHaveBeenCalledWith('test prompt');
  });

  it('should call onGenerate when button clicked', () => {
    const onGenerate = vi.fn();
    render(<DiagramInput {...mockProps} prompt="test" onGenerate={onGenerate} />);

    const button = screen.getByText('다이어그램 생성');
    fireEvent.click(button);

    expect(onGenerate).toHaveBeenCalled();
  });

  it('should disable button when loading', () => {
    render(<DiagramInput {...mockProps} isLoading={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should disable button when prompt is empty', () => {
    render(<DiagramInput {...mockProps} prompt="" />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show loading text when loading', () => {
    render(<DiagramInput {...mockProps} isLoading={true} />);
    expect(screen.getByText('생성 중...')).toBeInTheDocument();
  });

  it('should show correct placeholder for selected type', () => {
    render(<DiagramInput {...mockProps} type="pie" />);
    const textarea = screen.getByLabelText('설명을 입력하세요');
    expect(textarea).toHaveProperty('placeholder', '예: 월별 매출 비중 - 1월(25%), 2월(30%), 3월(45%)');
  });

  it('should render all diagram type options', () => {
    render(<DiagramInput {...mockProps} />);
    const select = screen.getByLabelText('다이어그램 타입');
    const options = select.querySelectorAll('option');

    expect(options).toHaveLength(8);
    expect(options[0]).toHaveTextContent('플로우차트');
    expect(options[1]).toHaveTextContent('시퀀스 다이어그램');
    expect(options[2]).toHaveTextContent('파이 차트');
  });
});
