package auth

import (
	"context"
	"errors"
	"strings"

	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/thanhnhat23/Haruko-LN/internal/user"
)

const mysqlErrDuplicateEntry = 1062

var ErrDuplicateLink = errors.New("linked")

type Repository struct {
	db *gorm.DB
}

func NewResposity(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindOAuthAcc(ctx context.Context, provider, providerUID string) (*OAuthAccount, error) {
	var acc OAuthAccount
	err := r.db.WithContext(ctx).
		Where("provider = ? AND provider_user_id = ?", provider, providerUID).
		First(&acc).Error
	if err != nil {
		return nil, err
	}
	return &acc, nil
}

func (r *Repository) FindUserByID(ctx context.Context, id uuid.UUID) (*user.User, error) {
	var u user.User
	if err := r.db.WithContext(ctx).Unscoped().First(&u, "user_id = ?", id).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *Repository) FindUserByEmail(ctx context.Context, email string) (*user.User, error) {
	var u user.User
	if err := r.db.WithContext(ctx).Unscoped().Where("email = ?", email).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *Repository) UsernameExists(ctx context.Context, name string) (bool, error) {
	var n int64
	err := r.db.WithContext(ctx).Unscoped().Model(&user.User{}).Where("username = ?", name).Count(&n).Error
	return n > 0, err
}

func (r *Repository) LinkOAuthAcc(ctx context.Context, acc *OAuthAccount) error {
	err := r.db.WithContext(ctx).Create(acc).Error
	if isDuplicateLink(err) {
		return ErrDuplicateLink
	}
	return err
}

func (r *Repository) CreateUserWithOAuth(ctx context.Context, u *user.User, acc *OAuthAccount) error {
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(u).Error; err != nil {
			return err
		}
		acc.UserID = u.User_ID
		return tx.Create(acc).Error
	})
	if isDuplicateLink(err) {
		return ErrDuplicateLink
	}
	return err
}

func isDuplicateLink(err error) bool {
	var me *mysql.MySQLError
	return errors.As(err, &me) &&
		me.Number == mysqlErrDuplicateEntry &&
		strings.Contains(me.Message, "uq_oauth_provider_uid")
}
