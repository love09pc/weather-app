import React, { useState } from 'react';
import './App.css';

// OpenWeather API Key (직접 입력하세요)
const API_KEY = 'e18b405b789c54649e4d838c265e1b29';

function App() {
  // 도시 이름을 입력받기 위한 state
  
  const [city, setCity] = useState('');
  // 날씨 정보를 저장할 state
  const [weather, setWeather] = useState(null);
  // 에러 메시지를 저장할 state
  const [error, setError] = useState('');

  // input 값이 변경될 때마다 city state를 업데이트
  const handleInputChange = (e) => {
    setCity(e.target.value);
    setError(''); // 입력이 바뀌면 에러 메시지 초기화
  };

  // input에서 Enter 키를 누르면 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = async () => {
    if (!city) return; // 입력값이 없으면 아무 동작 안함
    try {
      // OpenWeather API 호출 (단위: metric -> 섭씨)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        // 응답이 실패하면(404 등) 에러 처리
        throw new Error('도시를 찾을수없습니다.');
      }
      const data = await response.json();
      // 날씨 정보 state에 저장 (아이콘 정보 포함)
      setWeather({
        city: data.name,
        temp: data.main.temp,
        desc: data.weather[0].description,
        icon: data.weather[0].icon, // 아이콘 코드 저장
      });
      setError(''); // 성공 시 에러 메시지 초기화
    } catch (error) {
      // 에러 메시지를 화면에 표시
      setError(error.message);
      setWeather(null);
    }
  };

  return (
    <div className="app-container">
      {/* 검색창과 버튼을 한 줄로 묶는 input-group */}
      <div className="input-group">
        <input
          type="text"
          placeholder="도시 이름을 입력하세요"
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Enter 키 입력 이벤트 추가
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      {/* 에러 메시지 표시 (빨간 글씨) */}
      {error && (
        <div style={{ color: 'red', marginTop: '12px', fontWeight: 'bold' }}>{error}</div>
      )}
      {/* 날씨 정보 표시 */}
      <div className="weather-info">
        {/* weather 정보가 있으면 표시, 없으면 기본 안내 */}
        {weather ? (
          <>
            {/* OpenWeather 날씨 아이콘 (온도 위에 크게 표시) */}
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
              alt="weather icon"
              style={{ width: '100px', height: '100px', marginBottom: '8px' }}
            />
            <h2>{weather.city}</h2>
            <p>{weather.temp}&#8451;</p>
            <p>{weather.desc}</p>
          </>
        ) : (
          <p>도시를 입력하고 검색을 눌러주세요.</p>
        )}
      </div>
    </div>
  );
}

export default App;
