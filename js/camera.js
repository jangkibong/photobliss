
$(function(){
    const video = document.getElementById('video');
    const btn_camera_swiching = document.querySelector(".btn.camera_switch");
    const btn_camera_flip = document.querySelector(".btn.camera_flip");
    const shutter_timer = $(".set_timer");
    const btn_shutter = $(".btn.shutter");
    const canvas = document.getElementById('canvas');
    const box_preview_item = $(".shootihg_box .picture li");
    
    let stream;
    let currentDeviceIndex = 0;
    let photoCount = 0;
    let timer = shutter_timer.text(); // 기본 timer 10
    let shutter_status = false; //촬영중 : true, 촬영 정지 : false 
    let shutter_chance = window.localStorage.getItem("shutter chance"); // 8, 6, 4
    let camera_flip_mode = true;
    
    // 선택한 카메라 유지
    currentDeviceIndex = localStorage.getItem("current camera");

    function getCameraStream(){
        navigator.mediaDevices.enumerateDevices()// 현재 연결된 미디어 입/출력 장치 목록 반환
        .then(function(device){
            const videoDevices = device.filter(device => device.kind === 'videoinput' && !device.label.toLowerCase().includes("virtual")); // 미디어장치 중 videoinupt 종류만 가져오기, 가상(virtual)카메라는 제외
            console.log('연결된 카메라');
            console.log(videoDevices);
            localStorage.setItem("connecting video count", videoDevices.length); // 연결된 videoinput을 로컬스토리지에 저장
            // 연결된 카메라가 2개 이상일 때 카메라 전환 버튼 노출 
            // if(videoDevices.length > 1){
            //     btn_camera_swiching.style.display = 'block';
            // }else{
            //     btn_camera_swiching.style.display = 'none';
            // }
            return navigator.mediaDevices.getUserMedia({video: {deviceId: videoDevices[currentDeviceIndex].deviceId}});
        })
        .then(function(newStream){
            if(stream){
                stream.getTracks().forEach(track => track.stop());
            }
            stream = newStream;
            video.srcObject = stream;
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            console.log("해상도: " + settings.width + " x " + settings.height);
        })
        .catch(function(error){
            console.error('카메라 연결을 확인해주세요', error)
            alert('카메라 연결을 확인해주세요');
        });
    }
    
    // 카메라가 flip 모드일 때 비디오 화면 반전시키기
    function flipCamera (){
        if(camera_flip_mode == true){
            video.style.transform = "scaleX(-1)"
        } else{
            video.style.transform = "scaleX(1)"
        }
    }

    getCameraStream();
    flipCamera();

    btn_camera_flip.addEventListener('click', function(){
        if(camera_flip_mode == true){
            camera_flip_mode = false;
        } else{
            camera_flip_mode = true;
        }
        console.log(camera_flip_mode)
        flipCamera();
    });


    btn_camera_swiching.addEventListener("click", function(){
        let videoCount = localStorage.getItem("connecting video count"); // getCameraStream()에서 로컬스토리지에 저장한 카메라 수를 불러오기
        if(currentDeviceIndex < videoCount - 1){
            currentDeviceIndex ++
        } else{
            currentDeviceIndex = 0;
        }
        localStorage.setItem("current camera", currentDeviceIndex);
        getCameraStream();
    });
    
    /* 촬영 시작 버튼 클릭 */
    btn_shutter.on('click', function(){
        
        if(!shutter_status){
            shutter_status = true;
            
            $(".btn_ic.prev").attr('disabled', true).click(function(){return false;}); // "이전"버튼 비활성화
            btn_shutter.attr('disabled', true); // "촬영시작"버튼 비활성화
            console.log("남은 셔터 수", shutter_chance);
            let reset_timer = timer;
            
            /* 촬영 타이머 카운트다운 */
            interval_count = setInterval(function(){
                timer --;
                shutter_timer.text(timer)
                
                if(timer >= 0){
                } else{
                    shutter_timer.text(reset_timer); // 화면에 보이는 촬영 타이머 리셋
                    timer = shutter_timer.text();  //timer 변수를 리셋한 값으로 재할당
                    shutter_status = false;
                    shutter_chance --; // 셔터 기회 차감
                    console.log("남은 셔터 수", shutter_chance); //남은 셔터 기회 콘솔창에 보여주기
                    
                    // Canvas에 비디오 화면 그리기
                    if(camera_flip_mode == true){
                        const canvasContext = canvas.getContext('2d');
                        canvas.width = video.videoWidth * 0.8; // 8장 이상 촬영 시 localstorage 용량초과로 인해 사이즈 줄임
                        canvas.height = video.videoHeight * 0.8; // 8장 이상 촬영 시 localstorage 용량초과로 인해 사이즈 줄임
                        canvasContext.scale(-1, 1); // 이미지를 수평으로 반전시킵니다
                        canvasContext.drawImage(video, 0, 0, -canvas.width, canvas.height);
                    } else{
                        canvas.width = video.videoWidth * 0.8; // 8장 이상 촬영 시 localstorage 용량초과로 인해 사이즈 줄임
                        canvas.height = video.videoHeight * 0.8; // 8장 이상 촬영 시 localstorage 용량초과로 인해 사이즈 줄임
                        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    }

                    
                    // Canvas의 이미지를 Data URL로 변환하여 저장
                    const imgData = canvas.toDataURL('image/png');
                    
                    // 이미지를 로컬 스토리지에 저장 
                    localStorage.setItem("photo_" + photoCount, imgData);
                    
                    // 이미지를 사진 미리보기에 background-image로 지정
                    let photoPreview = box_preview_item[photoCount];
                    // console.log(photoPreview);
                    photoPreview.style.backgroundImage = 'url(' + localStorage.getItem('photo_' + photoCount);
                    
                    photoCount ++;

                    if(shutter_chance == 0){
                        clearInterval(interval_count); // 남은 셔터수가 0되면 카운트다운 종료 
                        $(".btn_ic.next").removeClass('hide'); // "다음"버튼 노출
                        shutter_timer.text('');
                        canvas.style.display = 'block';
                    }
                }
            },1000);
            
        }
    });

});