package auth

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

)

type OAuthAccount struct{
	ID uuid.UUID `gorm:"type:varchar(255);primaryKey"`
	UserID uuid.UUID `gorm:"type:char(36);not null;index"`
	Provider string `gorm:"type:varchar(32);not null;uniqueIndex:uq_oauth_provider_uid"`
	ProviderUserID string `gorm:"type:varchar(255);not null;uniqueIndex:uq_oauth_provider_uid"`
	CreateAt time.Time `gorm:"not null;autoCreateTime" `
}
func (OAuthAccount) TableName() string{
	return 	"oauth_accounts"
}
func (a *OAuthAccount) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		id, err := uuid.NewV7()
		if err != nil {
			return err
		}
		a.ID = id
	}
	return nil
}