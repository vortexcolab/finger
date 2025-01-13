::: {#main}
Global {#global .page-title}
======

::: {.section}

::: {.container-overview}
:::

### Members {#members .subsection-title}

#### []{.type-signature}activeTab[ :\*]{.type-signature} {#activeTab .name}

::: {.description}
Description placeholder
:::

##### Type:

-   [\*]{.param-type}

Source:

:   -   [background/service-worker.js](background_service-worker.js.html),
        [line 7](background_service-worker.js.html#line7)

#### [(constant) ]{.type-signature}config[ :object]{.type-signature} {#config .name}

##### Type:

-   [object]{.param-type}

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        16](contentScripts_main.js.html#line16)

#### [(constant) ]{.type-signature}extensionId[ :string]{.type-signature} {#extensionId .name}

##### Type:

-   [string]{.param-type}

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        5](contentScripts_main.js.html#line5)

#### [(constant) ]{.type-signature}fingerstatus[ :object]{.type-signature} {#fingerstatus .name}

##### Type:

-   [object]{.param-type}

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        21](contentScripts_main.js.html#line21)

#### [(constant) ]{.type-signature}logLevel[ :number]{.type-signature} {#logLevel .name}

##### Type:

-   [number]{.param-type}

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        11](contentScripts_main.js.html#line11)

#### [(constant) ]{.type-signature}techniques[ :Object]{.type-signature} {#techniques .name}

::: {.description}
Description placeholder
:::

##### Type:

-   [Object]{.param-type}

Source:

:   -   [contentScripts/techniques.js](contentScripts_techniques.js.html),
        [line 6](contentScripts_techniques.js.html#line6)

### Methods {#methods .subsection-title}

#### []{.type-signature}addToProxy[(params)]{.signature}[ → {\*}]{.type-signature} {#addToProxy .name}

::: {.description}
This function initialized the interceptions to make trought proxy
methodology. These intructions was configured previously in
\'/confi/config.json\'.
:::

##### Parameters:

+-----------------------+-----------------------+-----------------------+
| Name                  | Type                  | Description           |
+=======================+=======================+=======================+
| `params`              | [Object]{.param-type} | It receives an item   |
|                       |                       | with varios property, |
|                       |                       | And name is the       |
|                       |                       | expression that we    |
|                       |                       | want setup            |
|                       |                       | interceptions.        |
|                       |                       |                       |
|                       |                       | ###### Properties     |
|                       |                       |                       |
|                       |                       |   Name                |
|                       |                       |        Type           |
|                       |                       |           Description |
|                       |                       |   -----------         |
|                       |                       | ----- --------------- |
|                       |                       | -------- ------------ |
|                       |                       | --------------------- |
|                       |                       | --------------------- |
|                       |                       | --------------------- |
|                       |                       |   `register           |
|                       |                       | Type`   [String]{.par |
|                       |                       | am-type}   The regist |
|                       |                       | erType is a string re |
|                       |                       | presenting \'occurren |
|                       |                       | ce\' or \'presence\'. |
|                       |                       |   `name`              |
|                       |                       | [String]{.param-type} |
|                       |                       |    The name of the ex |
|                       |                       | pression that we want |
|                       |                       |  setup interceptions. |
+-----------------------+-----------------------+-----------------------+

Author:

:   -   Pedro Correia

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        178](contentScripts_main.js.html#line178)

##### Returns:

Type
:   [\*]{.param-type}

#### []{.type-signature}applyConfig[(config)]{.signature}[]{.type-signature} {#applyConfig .name}

::: {.description}
Apply the initial configurations.
:::

##### Parameters:

  Name       Type                Description
  ---------- ------------------- ----------------------------------------------
  `config`   [\*]{.param-type}   Contents of the file \"/config/config.json\"

Author:

:   -   Pedro Correia

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        351](contentScripts_main.js.html#line351)

#### []{.type-signature}calculateStatus[()]{.signature}[ → {Object}]{.type-signature} {#calculateStatus .name}

::: {.description}
Calculate the current status.
:::

Author:

:   -   Pedro Correia

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        50](contentScripts_main.js.html#line50)

##### Returns:

::: {.param-desc}
-   An Object containing an array of the tags/techniques that was
    captured that will be presented in the popup interface, and the
    registered entropy.
:::

Type
:   [Object]{.param-type}

#### []{.type-signature}interceptAttribute[(params)]{.signature}[ → {\*}]{.type-signature} {#interceptAttribute .name}

::: {.description}
This function initialized the interceptions to make trought property
modification methodology. These intructions was configured previously in
\'/confi/config.json\'.
:::

##### Parameters:

+-----------------------+-----------------------+-----------------------+
| Name                  | Type                  | Description           |
+=======================+=======================+=======================+
| `params`              | [Object]{.param-type} | It receives an item   |
|                       |                       | with varios property, |
|                       |                       | And name is the       |
|                       |                       | expression that we    |
|                       |                       | want setup            |
|                       |                       | interceptions.        |
|                       |                       |                       |
|                       |                       | ###### Properties     |
|                       |                       |                       |
|                       |                       |   Name                |
|                       |                       |        Type           |
|                       |                       |           Description |
|                       |                       |   -----------         |
|                       |                       | ----- --------------- |
|                       |                       | -------- ------------ |
|                       |                       | --------------------- |
|                       |                       | --------------------- |
|                       |                       | --------------------- |
|                       |                       |   `register           |
|                       |                       | Type`   [String]{.par |
|                       |                       | am-type}   The regist |
|                       |                       | erType is a string re |
|                       |                       | presenting \'occurren |
|                       |                       | ce\' or \'presence\'. |
|                       |                       |   `name`              |
|                       |                       | [String]{.param-type} |
|                       |                       |    The name of the ex |
|                       |                       | pression that we want |
|                       |                       |  setup interceptions. |
+-----------------------+-----------------------+-----------------------+

Author:

:   -   Pedro Correia

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        307](contentScripts_main.js.html#line307)

##### Returns:

Type
:   [\*]{.param-type}

#### []{.type-signature}interceptMethod[(params)]{.signature}[ → {\*}]{.type-signature} {#interceptMethod .name}

::: {.description}
This function initialized the interceptions to make trought method
override methodology. These intructions was configured previously in
\'/confi/config.json\'.
:::

##### Parameters:

+-----------------------+-----------------------+-----------------------+
| Name                  | Type                  | Description           |
+=======================+=======================+=======================+
| `params`              | [Object]{.param-type} | It receives an item   |
|                       |                       | with varios property, |
|                       |                       | And name is the       |
|                       |                       | expression that we    |
|                       |                       | want setup            |
|                       |                       | interceptions.        |
|                       |                       |                       |
|                       |                       | ###### Properties     |
|                       |                       |                       |
|                       |                       |   Name                |
|                       |                       |        Type           |
|                       |                       |           Description |
|                       |                       |   ------------        |
|                       |                       | ----- --------------- |
|                       |                       | -------- ------------ |
|                       |                       | --------------------- |
|                       |                       | --------------------- |
|                       |                       | --------------------- |
|                       |                       |   `registerT          |
|                       |                       | ype`    [String]{.par |
|                       |                       | am-type}   The regist |
|                       |                       | erType is a string re |
|                       |                       | presenting \'occurren |
|                       |                       | ce\' or \'presence\'. |
|                       |                       |   `                   |
|                       |                       | prototype`       [Str |
|                       |                       | ing]{.param-type}   T |
|                       |                       | rue if is a prototype |
|                       |                       |  and False if isn\'t. |
|                       |                       |   `name`              |
|                       |                       | [String]{.param-type} |
|                       |                       |    The name of the ex |
|                       |                       | pression that we want |
|                       |                       |  setup interceptions. |
|                       |                       |   `is                 |
|                       |                       | Constructor`   [Strin |
|                       |                       | g]{.param-type}   Tru |
|                       |                       | e if is a constructor |
|                       |                       |  and False if isn\'t. |
+-----------------------+-----------------------+-----------------------+

Author:

:   -   Pedro Correia

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        246](contentScripts_main.js.html#line246)

##### Returns:

Type
:   [\*]{.param-type}

#### []{.type-signature}resolvePath[(path, initValue[opt]{.signature-attributes})]{.signature}[ → {boolean\|number\|undefined}]{.type-signature} {#resolvePath .name}

::: {.description}
Get the value of a symbol in the window. However this method is called
various times in this file with initValue=fingerStatus (global object).
:::

##### Parameters:

+-------------+-------------+-------------+-------------+-------------+
| Name        | Type        | Attributes  | Default     | Description |
+=============+=============+=============+=============+=============+
| `path`      | [string]{.  |             |             | Path to the |
|             | param-type} |             |             | symbol, it  |
|             |             |             |             | will be     |
|             |             |             |             | compatible  |
|             |             |             |             | with the    |
|             |             |             |             | format      |
|             |             |             |             | specified   |
|             |             |             |             | in          |
|             |             |             |             | /config/c   |
|             |             |             |             | onfig.json, |
|             |             |             |             | /config/    |
|             |             |             |             | status.json |
|             |             |             |             | and         |
|             |             |             |             | /content    |
|             |             |             |             | Scripts/tec |
|             |             |             |             | hniques.js. |
+-------------+-------------+-------------+-------------+-------------+
| `initValue` | [Object]{.  | \<          | window      | This is the |
|             | param-type} | optional\>\ |             | value used  |
|             |             |             |             | in the      |
|             |             |             |             | reducer. To |
|             |             |             |             | access      |
|             |             |             |             | values of   |
|             |             |             |             | Symbols in  |
|             |             |             |             | the         |
|             |             |             |             | f           |
|             |             |             |             | ingerstatus |
|             |             |             |             | it will be  |
|             |             |             |             | equal to    |
|             |             |             |             | fi          |
|             |             |             |             | ngerStatus. |
+-------------+-------------+-------------+-------------+-------------+

Author:

:   -   Pedro Correia

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        139](contentScripts_main.js.html#line139)

##### Returns:

::: {.param-desc}
-   Return the corresponding value of the symbol \'path\' within window
    object. However this method is called various times in this file
    with initValue=fingerStatus (global object).
:::

Type
:   [boolean]{.param-type} \| [number]{.param-type} \|
    [undefined]{.param-type}

#### []{.type-signature}updateBarometer[(entropy, tags)]{.signature}[]{.type-signature} {#updateBarometer .name}

::: {.description}
Description placeholder
:::

##### Parameters:

  Name        Type                Description
  ----------- ------------------- -------------
  `entropy`   [\*]{.param-type}   
  `tags`      [\*]{.param-type}   

Source:

:   -   [action/script.js](action_script.js.html), [line
        8](action_script.js.html#line8)

#### []{.type-signature}updateRegisteredInterceptions[(registerType, name)]{.signature}[]{.type-signature} {#updateRegisteredInterceptions .name}

::: {.description}
Update the plugin status for an observed interception. It runs
internally.
:::

##### Parameters:

  Name             Type                    Description
  ---------------- ----------------------- ------------------------------------------------------------------------
  `registerType`   [string]{.param-type}   It is consigured to receive 2 values (\'ocurrences\' or \'presence\').
  `name`           [string]{.param-type}   Name of the symbol that FINGER observed the interception.

Author:

:   -   Pedro Correia

Source:

:   -   [contentScripts/main.js](contentScripts_main.js.html), [line
        152](contentScripts_main.js.html#line152)
:::
:::

[Home](index.html)
------------------

### Global

-   [activeTab](global.html#activeTab)
-   [addToProxy](global.html#addToProxy)
-   [applyConfig](global.html#applyConfig)
-   [calculateStatus](global.html#calculateStatus)
-   [config](global.html#config)
-   [extensionId](global.html#extensionId)
-   [fingerstatus](global.html#fingerstatus)
-   [interceptAttribute](global.html#interceptAttribute)
-   [interceptMethod](global.html#interceptMethod)
-   [logLevel](global.html#logLevel)
-   [resolvePath](global.html#resolvePath)
-   [techniques](global.html#techniques)
-   [updateBarometer](global.html#updateBarometer)
-   [updateRegisteredInterceptions](global.html#updateRegisteredInterceptions)

\

Documentation generated by [JSDoc 4.0.4](https://github.com/jsdoc/jsdoc)
on Mon Jan 13 2025 16:31:05 GMT+0000 (Western European Standard Time)
