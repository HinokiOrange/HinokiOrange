package main

import (
	"fmt"
	"os"
	"path/filepath"
)

type Folder struct {
	Root string
	Err  error
}

func NewFolderByCallback(getter func() (string, error)) *Folder {
	dir, err := getter()
	return &Folder{Root: dir, Err: err}
}

func NewFolder(path string) *Folder {
	folder := &Folder{}

	if err := os.MkdirAll(path, os.ModePerm); err != nil {
		folder.Err = err
	}
	folder.Root = path

	return folder
}

func (folder *Folder) checkFile(rpath string) (string, error) {
	if folder.Err != nil {
		return "", folder.Err
	}

	path := filepath.Join(folder.Root, rpath)
	if info, err := os.Stat(path); err != nil {
		if err := os.MkdirAll(filepath.Dir(path), os.ModePerm); err != nil {
			return path, err
		} else if _, err := os.Create(path); err != nil {
			return path, err
		}
	} else if info.IsDir() {
		return path, fmt.Errorf("%s is a folder", path)
	}

	return path, nil
}

func (folder *Folder) Write(rpath string, data string) error {
	if path, err := folder.checkFile(rpath); err != nil {
		return err
	} else if err := os.WriteFile(path, []byte(data), os.ModePerm); err != nil {
		return err
	}
	return nil
}

func (folder *Folder) Read(rpath string) (string, error) {
	if path, err := folder.checkFile(rpath); err != nil {
		return "", err
	} else if data, err := os.ReadFile(path); err != nil {
		return "", err
	} else {
		return string(data), err
	}
}
