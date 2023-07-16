import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Recipe } from './recipe.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

const DB_EXIST = 'db-data';

import xml2js from "xml2js";
import { js2xml } from 'xml-js';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  recipeItems: any = [];
  recipeType: any;
  db: SQLiteObject
  recipeData: Recipe[]
  arrayData: any = [];

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private sqlite: SQLite,
  ) {
    this.platform.ready().then(() => {
      this.createDB();
      // this.loadXML()
      setTimeout(() => {
        this.loadXML()
        // if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        //   this.loadXML()
        // } else {
        // }
      }, 2000);
    });

  }

  createDB() {
    try {
      this.sqlite.create({
        name: 'recipe.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.db = db;
        this.createTable();
        console.log('database created / opened')
      }).catch(e => console.log(JSON.stringify(e)))
    } catch (err) {
      console.log(err)
    }
  }

  createTable() {
    this.db.executeSql(`CREATE TABLE recipe (
    recipe_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100),
    type VARCHAR(500),
    image_path TEXT,
    ingredients TEXT,
    steps TEXT
    );`, []).then((result) => alert('table created')).catch(e => console.log(JSON.stringify(e)))
  }

  async insertData(b) {
    let query = `INSERT INTO recipe ( name, type, image_path, ingredients, steps)
     VALUES ('${b.name}','${b.type}','${b.image_path}','${b.ingredients}','${b.steps}');`
    // console.log(query);
    return this.db.executeSql(query, [])
      .then((result) => console.log(result))
      .catch(e => console.log(JSON.stringify(e)))
  }

  async updateData(b) {
    // console.log(b)
    let query = `UPDATE recipe
    SET name = '${b.name}', type = '${b.type}', image_path = '${b.image_path}',
    ingredients = '${b.ingredients}', steps = '${b.steps}'
    WHERE recipe_id = ${b.id};`
    // console.log(query);
    this.db.executeSql(query, [])
      .then((result) => console.log(result))
      .catch(e => console.log(JSON.stringify(e)))
  }

  deleteData(id) {
    console.log('delete id:', id);

    let query = `DELETE FROM recipe WHERE recipe_id = ${id};`
    // console.log(query);
    return this.db.executeSql(query, [])
      .then((result) => {
        console.log(result)
        return result
      })
      .catch(e => console.log(JSON.stringify(e)))
  }

  loadDataFromDB() {
    let query = `SELECT * FROM recipe;`
    let arrayData = []
    console.log(query);
    return this.db.executeSql(query, [])
      .then((res) => {
        console.log(res.rows.length)
        for (let i = 0; i < res.rows.length; i++) {
          const ing = JSON.parse(res.rows.item(i).ingredients)
          const stp = JSON.parse(res.rows.item(i).steps)
          let body = {
            type: res.rows.item(i).type,
            recipe:
            {
              recipe_id: res.rows.item(i).recipe_id,
              name: res.rows.item(i).name,
              ingredients: JSON.parse(res.rows.item(i).ingredients),
              steps: JSON.parse(res.rows.item(i).steps),
              image_path: res.rows.item(i).image_path,
            }
          };
          arrayData.push(
            body
          )
        }

        this.recipeItems = arrayData;
        console.log('ArrayData', arrayData)
        return arrayData;
      })
      .catch(e => console.log(JSON.stringify(e)))
  }


  async insertXMLDataToDB(rcp) {
    // rcp: Recipe
    this.recipeData = []
    await rcp.forEach(el => {
      // rcp = el
      var d = el.recipe;
      var type = el.type
      var ing = JSON.stringify(d.ingredients)
      var step = JSON.stringify(d.steps)
      const body = {
        name: d.name,
        type: type, image_path: d.image_path,
        ingredients: ing, steps: step
      }
      console.log(body)
      this.insertData(body)

    }).then(res => {
      this.loadDataFromDB()
    })
  }

  checkDBifEmpty(data) {
    let query = `SELECT COUNT(*) AS TOTAL FROM recipe;`;
    console.log(query);
    this.db.executeSql(query, [])
      .then((res) => {
        const total = res.rows.item(0).TOTAL
        console.log(total)
        if (total == 0) {
          this.insertXMLDataToDB(data)
        } else {
          console.log('masuk')
          this.loadDataFromDB()
        }
      })
      .catch(e => console.log(JSON.stringify(e)))
  }

  //Load XML to JSON
  loadXML() {
    return this.http.get('/assets/xml/recipetypes.xml',
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType: 'text'
      })
      .subscribe((data) => {
        this.parseXML(data)
          .then((res) => {
            console.log('ALL RECIPE', res);
            if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
              this.recipeItems = res;
              return res
            } else {
              return this.checkDBifEmpty(res)
            }
          });
      });
  }

  parseXML(data) {
    return new Promise(resolve => {
      var k,
        arr = [],
        type = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: false
          });

      parser.parseString(data, function (err, result) {
        var obj = result.recipe;
        console.log(obj)
        for (k in obj.type) {
          var item = obj.type[k];
          for (var key in item) {
            type.push(key);
            let val = item[key];
            let json
            if (val instanceof Array) {
              for (var key2 in val) {
                json = {
                  "type": key, "recipe": val[key2]
                }
                arr.push(json);
              }
            } else {
              json = {
                "type": key, "recipe": item[key]
              }
              arr.push(json);
            }
          }
        }
        resolve(arr);
      });

      console.log(type)
      this.recipeType = type;
    });
  }

  closeDB() {
    this.db.close()
  }

}


