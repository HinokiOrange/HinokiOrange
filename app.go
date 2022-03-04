package main

import (
	"context"
	"os"

	"github.com/denisbrodbeck/machineid"
)

// App application struct
type App struct {
	ctx        context.Context
	userConfig *Folder
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		userConfig: NewFolderByCallback(os.UserConfigDir),
	}
}

// startup is called at application startup
func (b *App) startup(ctx context.Context) {
	// Perform your setup here
	b.ctx = ctx
}

// domReady is called after the front-end dom has been loaded
func (b *App) domReady(ctx context.Context) {
	// Add your action here
}

// shutdown is called at application termination
func (b *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

func (b *App) ReadUserConfig(rpath string) (string, error) {
	return b.userConfig.Read(rpath)
}

func (b *App) WriteUserConfig(rpath string, data string) (interface{}, error) {
	return nil, b.userConfig.Write(rpath, data)
}

func (b *App) GetMachineId() (string, error) {
	return machineid.ID()

}
