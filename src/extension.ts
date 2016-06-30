'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Retrieve the engine absolute path
    let absolutePath = context.asAbsolutePath("src/engine/");

    // Open the sparkiy preview
    let preview = new SparkiyPreview();
    preview.present(absolutePath).then(disposables => {
        // Handle disposables
        disposables.forEach(element => context.subscriptions.push(element));
    }, reason => {
        console.error("Request rejected with reason: ");
        console.error(reason);
    });
}

export default class SparkiyPreview {
    private uri: vscode.Uri;
    private enginePath: string;
    private provider: SparkiyScriptPreviewContentProvider;

    public present(enginePath: string): Thenable<vscode.Disposable[]> {
        // Retrieve script name and construct preview URI
        this.uri = SparkiyPreview.constructPreviewUri();        

        return new Promise((resolve, reject)=> {
            vscode.workspace.findFiles("**/*.script.lua", "").then(files => {
                // Populate the scripts paths collection
                let scriptsPaths: string[] = [];
                files.forEach(scriptUri => scriptsPaths.push(scriptUri.fsPath));

                // Instantiate preview provider and assign scheme
                this.provider = new SparkiyScriptPreviewContentProvider(enginePath, scriptsPaths);
                let registration = vscode.workspace.registerTextDocumentContentProvider(SparkiyScriptPreviewContentProvider.scheme, this.provider);

                // Show the preview
                vscode.commands
                    .executeCommand('vscode.previewHtml', this.uri, vscode.ViewColumn.Two)
                    .then((success) => {}, (reason) => {
                        vscode.window.showErrorMessage(reason);
                    });

                resolve([registration]);
            }, rejectReason => {
                reject(rejectReason);
            });
        });
    }

    static constructPreviewUri(): vscode.Uri {
        return vscode.Uri.parse(SparkiyScriptPreviewContentProvider.scheme + "://sparkiy-vsc/" + SparkiyPreview.getName(vscode.workspace.rootPath).replace(" ", "-") + " Preview");
    }

    static getName(path: string): string {
        let scriptName = path.split('\\').pop().split('/').pop();
        return scriptName;
    }

    static isSparkiyScript(path: string): boolean {
        return path.endsWith(".script.lua");
    }
}

export class SparkiyScriptPreviewContentProvider implements vscode.TextDocumentContentProvider {
    static scheme = "sparkiy-preview";
    private enginePath: string;
    private scriptsPaths: string[];

    constructor(enginePath: string, scriptsPaths: string[]) {
        this.enginePath = enginePath;
        this.scriptsPaths = scriptsPaths;
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        return this.createContent();
    }

    private createContent(): string {
        let includeScripts: string = "";
        this.getSparkiyEngineIncludes().forEach(includePath => {
            includeScripts += `<script src="${includePath}"></script>`;
        });
        let includeApis: string = "";
        this.getSparkiyApiIncludes().forEach(includePath => {
            let content = fs.readFileSync(includePath).toString();
            includeScripts += `<script type="text/lua">${content}</script>`;
        });
        let scripts: string = "";
        this.scriptsPaths.forEach(element => {
            let scriptContent = fs.readFileSync(element).toString();
            scripts += `<script type="text/lua">${scriptContent}</script>`;
        });

        return `
            <style>
                body { margin: 0; }
                canvas { width: 100%; height: 100% }
            </style>
            <body>
                ${includeScripts}
                ${includeApis}
                ${scripts}
            </body>`;
    }

    private getSparkiyEngineIncludes(): string[] {
        return [ 
            this.enginePath + "lua.vm.js",
            this.enginePath + "pixi.min.js",
            this.enginePath + "sparkiy.js"
        ];
    }

    private getSparkiyApiIncludes(): string[] {
        return [
            this.enginePath + "sparkiyApi.lua",
            this.enginePath + "sparkiyBootstrapper.lua"
        ];
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}
