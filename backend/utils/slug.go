package utils

import (
	"fmt"

	"github.com/gosimple/slug"
)

func GenerateSlug(title, uuid string) string {
	base := slug.Make(title)
	return fmt.Sprintf("%s-%s", base, uuid[:8])
}
