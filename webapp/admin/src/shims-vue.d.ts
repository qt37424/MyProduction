/*
=======================================================================================
* File : shims-vue.d.ts
* Description : Declare .vue for source. 
*               Fix bug Could not find a declaration file for module '../**.vue'. '../**.vue' implicitly has an 'any' type.t
=======================================================================================
* History *
=======================================================================================
* Number | Date(YYYYMMDD) | Description
---------|----------------|------------------------------------------------------------
*      1 |   2025-09-02   | Initial version
=======================================================================================
*/

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
