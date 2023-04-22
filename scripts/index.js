document.addEventListener('alpine:init', () => {
    Alpine.data('weather', () => ({ 
        init(){ 
         
        },
        res: null,
        latitude: null,
        longitude: null,
        city_search: null, 
        isLoadingCheck: false,
        isLoadingMyLoc: false,
        error: null,
         

        async getCurrentWeather() {
            if (this.city_search === null || this.city_search === ""){
               this.error = 'Please enter the location'
            }else{
                try {
                    this.isLoadingCheck = true
                    const q = this.city_search; 
                    await this.getWeatherData(q) 
                    this.city_search = this.res.location.name
                }catch(error){
                    this.error = error
                }finally{
                    this.isLoadingCheck = false
                }
            }
            
        },
        async getAutoWeather() { 
            try {
                this.isLoadingMyLoc = true
                if (this.latitude === null && this.longitude === null) {
                
                    const position = await this.getCurrentPosition();
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    
                    } 
                    const q = `${this.latitude}, ${this.longitude}`
                    await this.getWeatherData(q) 
                    this.city_search = this.res.location.name
                     
                }catch (error) {
                    console.log(error.message); 
                    this.error = error.message
                }finally{
                    this.isLoadingMyLoc = false

                }
            
        },
        async getWeatherData (q){
                const api_key = "46753031b1654daaad733947232104" 
                const url = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${q}&days=4&aqi=yes&alerts=yes`;
                try {
                     
                    const response = await fetch(url);
                    
                    if (response.status === 200) {
                        const data = await response.json();
                        this.res = data; 
                    }
                    else if(response.status === 400){
                        const data = await response.json();
                        console.log(data)
                        this.error = data.error.message
                    } 
                  } catch (error) {
                    console.error(error);
                    this.res = null;
                    this.error = error.message
                  }finally{
                    this.isLoading = false; 
                  }
        },
        async getCurrentPosition() {
            return new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject); 
            });
        },
        get getlocalTime() { 
            if (this.res !== null && this.res !== undefined){ 
                const dateString = this.res.location.localtime;
                const date = new Date(dateString);
                const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                return timeString;
            }else{
                return ''
            }
        },
        getDayOfWeek(dateStr) {
            const today = new Date()
            const date = new Date(dateStr);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let dayOfWeek = days[date.getDay()]; 
            const day = date.getDate();
            if (today.getDate() === date.getDate()){
                return 'Today'
            }
            return `${day} ${dayOfWeek}`;
        },
        getFormattedDate(dateString){ 
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            return formattedDate;
        },
        getWeatherColor(){
            if (this.res !== null){
                const temp = this.res.current.temp_c
                switch (temp) {
                    case temp < 20:
                        return "linear-gradient(to bottom right, #D9E2EF, #b3c0d5)"
                    case temp < 25:
                        return "linear-gradient(to bottom right, #E0E0E0, #b3c0d5)"
                    case temp < 30:
                        return "linear-gradient(to bottom right, #FFEFD5, #eec27b)"
                    default:
                        return "linear-gradient(to bottom right, #FFFACD, #f2e46b)"
                  }
            }else{
                return "linear-gradient(to bottom right, #D9E2EF, #b3c0d5)"
            }
            
        }
    }))
})