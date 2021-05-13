import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponde, Gif } from '../interface/gifs.interface';



@Injectable({
  //Con esto dice que el servicio es unico y estará disponible de manera global
  providedIn: 'root'
})



export class GifsService {
  private apikey: string='ehSYGwBWMtlQcyH9VMalMHm1dhpbFHE8';
  private servicioUrl: string='https://api.giphy.com/v1/gifs'
  private _historial: string[] = [];

  //Para almacenar los resultados
  //public resultados: any[] = []

  //Ahora sé q mis resultados son de tipo Gif como especiicque
  public resultados: Gif[] = []

  get historial(){
    return [...this._historial]
  }


  constructor(private http:HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    // if(localStorage.getItem('historial')){
    //   this._historial = JSON.parse(localStorage.getItem('historial')!)
    // }

    this.resultados = JSON.parse(localStorage.getItem("resultados")!) || [];
  }



  buscarGifs(query:string){

    // Recibir todo en minuscula
    query = query.trim().toLocaleLowerCase();

    // Solo lo vy a agregar si no está incluido
    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      //Guardar al local storage:
      //Ambos deben ser texto por lo que transformarlo
      localStorage.setItem('historial', JSON.stringify(this._historial))
    }


    // Usando params para el URL
    const params = new HttpParams()
    .set('api_key', this.apikey)
    .set('q', query)
    .set('limit', '10');

    console.log(params.toString());
    


    //Un modo de lllamar a la API con JS
    // fetch(
    //   'https://api.giphy.com/v1/gifs/search?api_key=ehSYGwBWMtlQcyH9VMalMHm1dhpbFHE8&q=pokemon&limit=20'
    //   ).then ( rpta => {
    //     rpta.json().then(data => {
    //       console.log(data);
    //     })
    //   })


    //ESto sería sin saber cuál va a ser el retorno --------
    //Esta peticion retorna observables
    //El subscribe es como un then, se ejecuta cuando se tiene resolucion del get
    // this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=ehSYGwBWMtlQcyH9VMalMHm1dhpbFHE8&q=${query}&limit=20`)
    // .subscribe((rpta:any) => {
    //   console.log(rpta.data);
    //   this.resultados = rpta.data;
    // })

    //Ahora que hemos creado nuestra interface
    //Especificaremos el tipo de get q obtendremos

    //ESto era sin los params
    //this.http.get<SearchGifsResponde>(`https://api.giphy.com/v1/gifs/search?api_key=ehSYGwBWMtlQcyH9VMalMHm1dhpbFHE8&q=${query}&limit=20`)
    //USando params:  -- Ojo params puede ser igual a params:params
    this.http.get<SearchGifsResponde>(`${this.servicioUrl}/search`, {params})
    .subscribe((rpta) => {
      console.log(rpta.data);
      this.resultados = rpta.data;

      //Almacenar los resultados en el Storage
      localStorage.setItem("resultados", JSON.stringify(this.resultados))
    })



  }
}
