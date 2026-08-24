package source

type languageEnum string

const (
	vi languageEnum = "Vietnamese"
	en languageEnum = "English"
	jp languageEnum = "Japanese"
)

type Source struct {
	source_id uint         `gorm:"primaryKey"`
	post_id   uint         `gorm:"not null;index"`
	url       string       `gorm:"type:varchar(255); not null" validate:"url"`
	language  languageEnum `gorm:"type:nvarchar(255); not null" validate:"required,oneof= Vietnamese English Japanese"`
	siteName  string       `gorm:"type:nvarchar(255)"`
}
