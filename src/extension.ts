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
    let disposables = preview.present(absolutePath);

    // Handle disposables
    disposables.forEach(element => context.subscriptions.push(element));
}

export default class SparkiyPreview {
    private uri: vscode.Uri;
    private enginePath: string;

    public present(enginePath: string): vscode.Disposable[] {
        // Retrieve script name and construct preview URI
        this.uri = SparkiyPreview.constructPreviewUri();

        // Instantiate preview provider and assign scheme
        let provider = new SparkiyScriptPreviewContentProvider(enginePath);
        let registration = vscode.workspace.registerTextDocumentContentProvider(SparkiyScriptPreviewContentProvider.scheme, provider);

        vscode.workspace.findFiles("**/*.script.lua", "").then(files => {
            files.forEach(scriptUri => {
                let scriptPath = scriptUri.fsPath;
                fs.readFile(scriptPath, (error, data) => {
                    console.log(data);
                });
            });
        });

        // Show the preview
        vscode.commands
            .executeCommand('vscode.previewHtml', this.uri, vscode.ViewColumn.Two)
            .then((success) => {}, (reason) => {
                vscode.window.showErrorMessage(reason);
            });

        return [registration];
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

    constructor(enginePath: string) {
        this.enginePath = enginePath;
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        return this.createContent();
    }

    private createContent(): string {
        let includeScripts: string = "";
        this.getSparkiyEngineIncludes().forEach(includePath => {
            includeScripts += `<script src="${includePath}"></script>`
        });

        return `
            <style>
                body { margin: 0; }
                canvas { width: 100%; height: 100% }
            </style>
            <body>
                ${includeScripts}
            </body>`;
    }

    private getSparkiyEngineIncludes(): string[] {
        return [ 
            this.enginePath + "pixi.min.js",
            this.enginePath + "sparkiy.js"
        ];
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}
