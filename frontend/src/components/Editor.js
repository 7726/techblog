'use client';

import { useMemo, useRef } from 'react'; // useRef, useMemo 추가
import dynamic from 'next/dynamic';
import api from '@/lib/axios'; // axios 인스턴스 가져오기
import 'react-quill-new/dist/quill.snow.css'; 

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-lg" /> 
});

export default function Editor({ value, onChange }) {
  // 에디터 접근을 위한 ref
  const quillRef = useRef(null);

  // 이미지 핸들러 (S3 업로드 로직)
  const imageHandler = () => {
    // 1. input file 태그 생성
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click(); // 파일 선택창 띄우기

    // 2. 파일 선택 시 동작
    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      // 3. 백엔드로 업로드 (FormData 사용)
      const formData = new FormData();
      formData.append('file', file);

      try {
        // 백엔드 엔드포인트 확인 필요: ImageController의 @PostMapping 확인
        // 보통 POST /api/images 혹은 /api/files/upload 입니다.
        // 지호님 코드 기준: ImageController가 있다면 해당 경로 사용
        const res = await api.post('/files/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // 4. 받아온 S3 URL을 에디터에 삽입
        // res.data.url 등 응답 구조에 맞게 수정 필요
        const url = res.data.url; 
        
        // 현재 커서 위치 가져오기
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection()?.index;

        if (range !== undefined && range !== null) {
          quill.insertEmbed(range, 'image', url);
          // 이미지 다음으로 커서 이동
          quill.setSelection(range + 1); 
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    };
  };

  // 모듈 설정 (useMemo로 감싸서 리렌더링 시 핸들러 유실 방지)
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'code-block'],
        ['clean']
      ],
      handlers: {
        // 여기서 기본 image 핸들러를 덮어씁니다.
        image: imageHandler,
      },
    },
  }), []);

  return (
    <div className="bg-white">
      <ReactQuill 
        ref={quillRef} // ref 연결 필수
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="h-[400px] mb-12"
      />
    </div>
  );
}