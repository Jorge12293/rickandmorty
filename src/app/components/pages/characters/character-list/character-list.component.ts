import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { Character } from '@app/shared/interfaces/character.interface';
import { CharacterService } from '@app/shared/services/character.service';
import { filter, take } from "rxjs/operators";

type RequestInfo={
  next:string;
}



@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {
  characters:Character[]=[];
  info : RequestInfo ={
    next:''
  };

  private pageNum=1;
  private query!:string;
  private hideScrollHeight=200;
  private showScrollHeight =500;

  constructor(
    private characterSvc:CharacterService,
    private route: ActivatedRoute,
    private router: Router
    ){ 
     this.onUrlChanged(); 
    }

  ngOnInit(): void {
    this.getCharactersByQuery();
  }

  private onUrlChanged():void{
    this.router.events.pipe(
      filter((event)=> event instanceof NavigationEnd))
      .subscribe(()=>{
        this.characters=[];
        this.pageNum=1;
        this.getCharactersByQuery();
      });
  }

  private getCharactersByQuery(): void{
    this.route.queryParams.pipe(take(1)).subscribe(params=> {
      console.log('params=> '+params['q']);
      this.query = params['q'];
      this.getDataFromService();
    });
  }

  private getDataFromService():void{
    this.characterSvc.searchCharacters(this.query,this.pageNum)
      .pipe(take(1))
      .subscribe((res:any)=>{
        if(res?.results?.length){
          console.log(res);
          const {info,results} = res;
          this.characters = [... this.characters, ...results];
          this.info=info;
        }else{
          this.characters = [];
        }
      });
  }
}
