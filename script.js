"use strict";

// CONFIGURACIÓN DOCENTE: cambiar a true para activar una espera de 30 segundos.
const CONTADOR_ACTIVO = false;
const SEGUNDOS_ESPERA = 30;
const LIMITE_EJECUCION_MS = 7000;

const DESAFIOS = [
  {
    titulo:'Mi primera repetición', contexto:'¿Y si queremos saludar cuatro veces sin copiar cuatro instrucciones?',
    teoria:'for repite un bloque de instrucciones. range(4) genera cuatro valores: 0, 1, 2 y 3. El código indentado pertenece al bucle.',
    ejemplo:'for i in range(3):\n    print("Hola")',
    mision:'Cambiá el programa para mostrar exactamente cuatro líneas con el mensaje Hola.',
    pista:'Conservá el for y modificá el número dentro de range().',
    inicio:'for i in range(3):\n    print("Hola")', esperado:['Hola','Hola','Hola','Hola'],
    regla:'range4', consejo:'Necesitás for i in range(4) y print("Hola") dentro del bloque.'
  },
  {
    titulo:'Controlamos las repeticiones', contexto:'Un programa debe avisar tres veces que estamos listos.',
    teoria:'El número de range(n) determina cuántos valores recorre el bucle. Si cambiás n, cambia la cantidad de vueltas.',
    ejemplo:'for i in range(2):\n    print("Listo")',
    mision:'Mostrá Listo exactamente tres veces usando for y range().',
    pista:'Revisá la cantidad de vueltas indicada por range().',
    inicio:'for i in range(5):\n    print("Listo")', esperado:['Listo','Listo','Listo'],
    regla:'range3', consejo:'Necesitás tres repeticiones, no cinco.'
  },
  {
    titulo:'La variable i cambia', contexto:'En cada vuelta, la variable i toma un valor diferente.',
    teoria:'Si escribís print(i) dentro del for, verás el valor de i en cada vuelta. range(4) genera 0, 1, 2 y 3.',
    ejemplo:'for i in range(3):\n    print(i)',
    mision:'Mostrá los números 0, 1, 2 y 3, cada uno en una línea, usando un for.',
    pista:'Dentro del bucle, mostrá la variable i sin comillas.',
    inicio:'for i in range(4):\n    print("i")', esperado:['0','1','2','3'],
    regla:'range4printi', consejo:'print(i) muestra el valor; print("i") muestra una letra.'
  },
  {
    titulo:'¿Por qué comienza en cero?', contexto:'A veces el último número esperado no aparece: no es un error de Python.',
    teoria:'range(n) comienza en cero y termina antes de n. Para mostrar de 0 a 5, necesitás range(6).',
    ejemplo:'for i in range(5):\n    print(i)  # 0, 1, 2, 3, 4',
    mision:'Modificá el programa para mostrar del 0 al 5 inclusive.',
    pista:'¿Cuántos valores hay entre 0 y 5, inclusive?',
    inicio:'for i in range(5):\n    print(i)', esperado:['0','1','2','3','4','5'],
    regla:'range6printi', consejo:'Para incluir el 5, el límite debe ser 6.'
  },
  {
    titulo:'Elegimos el comienzo', contexto:'También podemos indicar desde qué número queremos contar.',
    teoria:'range(inicio, fin) comienza en inicio y se detiene antes de fin. Por ejemplo, range(1, 4) produce 1, 2 y 3.',
    ejemplo:'for i in range(1, 4):\n    print(i)',
    mision:'Mostrá los números 1, 2, 3, 4 y 5 utilizando range() con dos argumentos.',
    pista:'Si queremos que aparezca 5, el segundo número debe ser 6.',
    inicio:'for i in range(1, 5):\n    print(i)', esperado:['1','2','3','4','5'],
    regla:'range1to6', consejo:'Probá con range(1, 6) y print(i).'
  },
  {
    titulo:'La indentación importa', contexto:'¿Qué sucede si queremos repetir un mensaje, pero mostrar otro solo al terminar?',
    teoria:'Los espacios al comienzo de la línea determinan qué pertenece al for. Una instrucción sin indentación se ejecuta después del bucle.',
    ejemplo:'for i in range(2):\n    print("Hola")\nprint("Fin")',
    mision:'Mostrá Hola tres veces y Fin una sola vez, en ese orden. Corregí el bloque del programa.',
    pista:'El print("Fin") debe empezar desde el margen izquierdo.',
    inicio:'for i in range(3):\n    print("Hola")\n    print("Fin")', esperado:['Hola','Hola','Hola','Fin'],
    regla:'finfuera', consejo:'Sacá la indentación de print("Fin") para que se ejecute al terminar el for.'
  },
  {
    titulo:'Detectives de bucles', contexto:'El siguiente programa funciona, pero no cumple con el pedido.',
    teoria:'Un error lógico es distinto de un error de sintaxis: el programa puede ejecutarse y aun así mostrar valores incorrectos.',
    ejemplo:'for i in range(3):\n    print(i)  # 0, 1, 2',
    mision:'Corregí el programa para mostrar exactamente 1, 2, 3 y 4, uno por línea.',
    pista:'Elegí el valor inicial y recordá que el valor final de range() no se incluye.',
    inicio:'for i in range(4):\n    print(i)', esperado:['1','2','3','4'],
    regla:'range1to5', consejo:'Probá range(1, 5), luego comprobá la salida.'
  },
  {
    titulo:'Mi programa repetitivo', contexto:'Último desafío: ahora el programa lo construís vos.',
    teoria:'Antes de escribir, pensá: ¿qué se repite?, ¿cuántas veces?, ¿qué valor tomará i? Después ejecutá, comprobá y corregí.',
    ejemplo:'for i in range(1, 4):\n    print(i)',
    mision:'Escribí desde cero un programa que muestre los números 1, 2, 3, 4 y 5; luego muestre exactamente una vez el mensaje Mision cumplida. Usá for y range().',
    pista:'Usá range(1, 6), print(i) dentro del bucle y otro print() sin indentación al final.',
    inicio:'# Escribí tu programa aquí\n', esperado:['1','2','3','4','5','Mision cumplida'],
    regla:'final', consejo:'La salida debe tener cinco números y, al terminar el bucle, Mision cumplida una sola vez.'
  }
];

const $ = id => document.getElementById(id);
let editor, trabajador, listo=false, cargando=false, ejecutando=false;
let indice=0, resultados=new Map(), ultimo=null, reloj=null, inicioDesafio=0, finalizado=false;
let ejecucionId=0, timeoutEjecucion=null;
const salidaLineas = texto => texto.trim().split(/\r?\n/).map(s=>s.trim()).filter(Boolean);

// El análisis del código se realiza con el módulo ast de Python, no con expresiones
// regulares que puedan confundir texto o comentarios con instrucciones reales.
const INSPECTOR = String.raw`import ast, json
try:
    tree=ast.parse(USER_CODE)
    loops=[n for n in ast.walk(tree) if isinstance(n,ast.For)]
    correct=False
    if len(loops)==1:
        loop=loops[0]
        iterator=loop.target.id if isinstance(loop.target,ast.Name) else None
        it=loop.iter
        args=[]
        if isinstance(it,ast.Call) and isinstance(it.func,ast.Name) and it.func.id=='range':
            for a in it.args:
                args.append(a.value if isinstance(a,ast.Constant) and type(a.value)==int else None)
        def is_print(n, value):
            if not isinstance(n,ast.Expr) or not isinstance(n.value,ast.Call): return False
            c=n.value
            if not isinstance(c.func,ast.Name) or c.func.id!='print' or len(c.args)!=1: return False
            a=c.args[0]
            if value=='i': return isinstance(a,ast.Name) and a.id==iterator
            return isinstance(a,ast.Constant) and a.value==value
        inside=loop.body
        outside=tree.body
        rule=RULE
        if rule=='range4': correct=len(outside)==1 and outside[0] is loop and args==[4] and len(inside)==1 and is_print(inside[0],'Hola')
        elif rule=='range3': correct=len(outside)==1 and outside[0] is loop and args==[3] and len(inside)==1 and is_print(inside[0],'Listo')
        elif rule=='range4printi': correct=len(outside)==1 and outside[0] is loop and args==[4] and len(inside)==1 and is_print(inside[0],'i')
        elif rule=='range6printi': correct=len(outside)==1 and outside[0] is loop and args==[6] and len(inside)==1 and is_print(inside[0],'i')
        elif rule=='range1to6': correct=len(outside)==1 and outside[0] is loop and args==[1,6] and len(inside)==1 and is_print(inside[0],'i')
        elif rule=='finfuera': correct=args==[3] and len(inside)==1 and is_print(inside[0],'Hola') and len(outside)==2 and outside[0] is loop and is_print(outside[1],'Fin')
        elif rule=='range1to5': correct=len(outside)==1 and outside[0] is loop and args==[1,5] and len(inside)==1 and is_print(inside[0],'i')
        elif rule=='final': correct=args==[1,6] and len(inside)==1 and is_print(inside[0],'i') and len(outside)==2 and outside[0] is loop and is_print(outside[1],'Mision cumplida')
    RESULT_JSON=json.dumps({'correct':bool(correct)})
except Exception as exc:
    RESULT_JSON=json.dumps({'correct':False, 'reason':str(exc)})
RESULT_JSON`;

function crearTrabajador() {
  if(trabajador) trabajador.terminate();
  listo=false;
  $('python-status').textContent='⌛ Preparando Python…';
  $('python-status').className='header-pill';
  $('run-btn').disabled=true;
  const workerCode = `
    let pyodide;
    self.onmessage=async e=>{
      const m=e.data;
      try{
        if(m.type==='init'){
          importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
          pyodide=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
          self.postMessage({type:'ready'}); return;
        }
        if(m.type==='run'){
          const output=[];
          pyodide.setStdout({batched:s=>output.push(s)});
          pyodide.setStderr({batched:s=>output.push(s)});
          let error='';
          try{await pyodide.runPythonAsync(m.code)}catch(ex){error=String(ex.message||ex)}
          let inspection={correct:false};
          if(!error){
            pyodide.globals.set('USER_CODE',m.code);
            pyodide.globals.set('RULE',m.rule);
            try{inspection=JSON.parse(pyodide.runPython(m.inspector))}catch(ex){inspection={correct:false,reason:String(ex)}}
          }
          self.postMessage({type:'result',id:m.id,output:output.join(String.fromCharCode(10)).slice(0,15000),error,inspection});
        }
      }catch(ex){self.postMessage({type:'fatal',message:String(ex.message||ex)})}
    }`;
  const blobUrl=URL.createObjectURL(new Blob([workerCode],{type:'text/javascript'}));
  trabajador=new Worker(blobUrl);
  URL.revokeObjectURL(blobUrl);
  trabajador.onmessage=e=>{
    const m=e.data;
    if(m.type==='ready'){
      listo=true;cargando=false;
      $('python-status').textContent='● Python listo';$('python-status').className='header-pill ready';
      $('run-btn').disabled=false; actualizarTemporizador();return;
    }
    if(m.type==='fatal'){
      cargando=false;ejecutando=false;
      $('python-status').textContent='⚠ No se pudo cargar Python';$('python-status').className='header-pill error';
      $('console-output').textContent=m.message;return;
    }
    if(m.type==='result'&&m.id===ejecucionId){
      clearTimeout(timeoutEjecucion); ejecutando=false;
      ultimo={codigo:editor.getValue(),lineas:salidaLineas(m.output),error:!!m.error,correcto:!!m.inspection?.correct,razon:m.inspection?.reason||''};
      $('console-output').textContent=m.error?`Error de Python:\n${m.error}`:(m.output||'(Sin salida)');
      $('console-output').classList.toggle('error',!!m.error);
      $('run-label').textContent=m.error?'Revisá el código':'Ejecución terminada';
      if(m.error) feedback('warning','Python encontró un error. Leé la consola, corregí y volvé a probar.');
      $('run-btn').disabled=false;actualizarTemporizador();
    }
  };
  trabajador.onerror=()=>{cargando=false;ejecutando=false;$('python-status').textContent='⚠ Error al cargar Python';$('run-label').textContent='Revisá la conexión';};
  cargando=true;trabajador.postMessage({type:'init'});
}

function feedback(tipo,mensaje){const el=$('challenge-feedback');el.className=`feedback ${tipo}`;el.textContent=mensaje;el.hidden=false;}
function actualizarTemporizador(){
  clearInterval(reloj);
  const pintar=()=>{
    const faltan=CONTADOR_ACTIVO?Math.max(0,SEGUNDOS_ESPERA-Math.floor((Date.now()-inicioDesafio)/1000)):0;
    $('check-btn').disabled=!listo||ejecutando||!ultimo||ultimo.error||faltan>0||resultados.get(indice)===true;
    $('timer-message').textContent=!CONTADOR_ACTIVO?'Modo de prueba: espera desactivada.':faltan?`Podrás comprobar en ${faltan} segundos.`:'Ya podés comprobar el desafío.';
    if(!faltan)clearInterval(reloj);
  };
  pintar();if(CONTADOR_ACTIVO)reloj=setInterval(pintar,250);
}
function presentarDesafio(){
  const d=DESAFIOS[indice];
  $('challenge-title').textContent=d.titulo;$('challenge-context').textContent=d.contexto;
  $('challenge-theory').textContent=d.teoria;$('challenge-example').textContent=d.ejemplo;
  $('challenge-instruction').textContent=d.mision;$('challenge-hint').textContent=d.pista;
  $('challenge-counter').textContent=`${indice+1} de ${DESAFIOS.length}`;
  $('progress-fill').style.width=`${100*(indice+1)/DESAFIOS.length}%`;
  $('previous-btn').disabled=indice===0;
  $('next-btn').disabled=!resultados.get(indice);
  $('next-btn').textContent=indice===DESAFIOS.length-1?'¡Terminado! ✓':'Siguiente →';
  $('challenge-feedback').hidden=true;document.querySelector('.hint').open=false;
  editor.setValue(d.inicio);ultimo=null;inicioDesafio=Date.now();
  $('console-output').textContent='Tu programa mostrará aquí sus resultados.';$('console-output').classList.remove('error');
  $('run-label').textContent='Lista para ejecutar';actualizarTemporizador();editor.refresh();
}
function ejecutar(){
  if(!listo||ejecutando)return;
  ejecutando=true;ultimo=null;ejecucionId++;
  const id=ejecucionId,codigo=editor.getValue();
  $('run-btn').disabled=true;$('check-btn').disabled=true;
  $('run-label').textContent='Ejecutando…';$('challenge-feedback').hidden=true;
  trabajador.postMessage({type:'run',id,code:codigo,rule:DESAFIOS[indice].regla,inspector:INSPECTOR});
  timeoutEjecucion=setTimeout(()=>{
    if(!ejecutando||id!==ejecucionId)return;
    ejecutando=false;ultimo=null;ejecucionId++;
    $('console-output').textContent='El programa tardó demasiado. Revisá si creaste una repetición infinita. Se reiniciará Python.';
    $('console-output').classList.add('error');$('run-label').textContent='Tiempo agotado';
    crearTrabajador();actualizarTemporizador();
  },LIMITE_EJECUCION_MS);
}
function comprobar(){
  if(!ultimo||ultimo.error||ejecutando||!listo)return;
  if(CONTADOR_ACTIVO&&Date.now()-inicioDesafio<SEGUNDOS_ESPERA*1000)return;
  const d=DESAFIOS[indice];
  if(ultimo.codigo!==editor.getValue()){feedback('warning','Cambiaste el código después de ejecutarlo. Volvé a ejecutar antes de comprobar.');return;}
  const salidaCorrecta=JSON.stringify(ultimo.lineas)===JSON.stringify(d.esperado);
  if(salidaCorrecta&&ultimo.correcto){
    resultados.set(indice,true);
    feedback('success',indice===7?'¡Excelente! Completaste los ocho desafíos. Presioná ¡Terminado!':'¡Muy bien! Tu código usa el bucle correctamente y muestra lo esperado.');
    $('next-btn').disabled=false;
  }else{
    feedback('warning',(salidaCorrecta?'La salida coincide. Revisá que el bucle tenga el rango y las instrucciones pedidos. ':'Todavía hay algo para ajustar. ')+d.consejo+' Volvé a ejecutar y comprobá.');
  }
  actualizarTemporizador();
}
function iniciar(){
  const area=$('code-input');
  if(window.CodeMirror){editor=CodeMirror.fromTextArea(area,{mode:'python',theme:'material-darker',lineNumbers:true,indentUnit:4,tabSize:4,indentWithTabs:false,lineWrapping:true,extraKeys:{Tab:cm=>cm.replaceSelection('    ')}});}
  else{area.style.cssText='display:block;width:100%;height:290px;background:#0b1325;color:white;font:15px monospace';editor={getValue:()=>area.value,setValue:v=>area.value=v,on:(_,fn)=>area.addEventListener('input',fn),refresh:()=>{}};}
  editor.on('change',()=>{ultimo=null;actualizarTemporizador();$('run-label').textContent='Cambios sin ejecutar';});
  $('run-btn').addEventListener('click',ejecutar);$('check-btn').addEventListener('click',comprobar);
  $('reset-btn').addEventListener('click',()=>{editor.setValue(DESAFIOS[indice].inicio);$('challenge-feedback').hidden=true;});
  $('previous-btn').addEventListener('click',()=>{if(indice>0&&!ejecutando){indice--;presentarDesafio();}});
  $('next-btn').addEventListener('click',()=>{
    if(ejecutando)return;
    if(finalizado){finalizado=false;resultados.clear();indice=0;presentarDesafio();return;}
    if(!resultados.get(indice))return;
    if(indice<7){indice++;presentarDesafio();return;}
    finalizado=true;$('challenge-title').textContent='¡Laboratorio completado!';
    $('challenge-context').textContent='¡Felicitaciones! Ya podés explicar, ejecutar y corregir bucles con for y range().';
    $('challenge-instruction').textContent='Ahora podés continuar con las actividades impresas y explicar tus decisiones.';
    $('next-btn').textContent='↻ Volver a empezar';
    feedback('success','Completaste los ocho desafíos. ¡Muy buen trabajo!');
  });
  presentarDesafio();crearTrabajador();
}
window.addEventListener('DOMContentLoaded',iniciar);
