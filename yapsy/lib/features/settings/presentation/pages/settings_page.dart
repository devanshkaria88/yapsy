import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../bloc/settings_cubit.dart';
import 'edit_profile_sheet.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});
  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  @override
  void initState() {
    super.initState();
    context.read<SettingsCubit>().loadProfile();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Settings')),
      body: BlocBuilder<SettingsCubit, SettingsState>(
        builder: (context, state) {
          final profile = state is SettingsLoaded ? state.profile : null;
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.md),
            children: [
              // Profile card
              GestureDetector(
                onTap: () {
                  if (profile != null) EditProfileSheet.show(context, profile: profile);
                },
                child: Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: AppColors.primarySurface,
                        child: Text(
                          (profile?.name.isNotEmpty == true) ? profile!.name[0].toUpperCase() : 'U',
                          style: AppTypography.h2.copyWith(color: AppColors.primary),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(profile?.name ?? 'Loading...', style: AppTypography.bodyLarge),
                            Text(profile?.email ?? '', style: AppTypography.caption),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right, color: AppColors.textTertiary),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: AppSpacing.lg),

              // Subscription
              _SettingsTile(
                icon: Icons.star_rounded,
                title: 'Subscription',
                subtitle: profile?.isPro == true ? 'Yapsy Pro' : 'Free plan',
                onTap: () => context.go(RoutePaths.subscription),
              ),

              _SettingsTile(
                icon: Icons.notifications_outlined,
                title: 'Notifications',
                subtitle: 'Manage reminders',
                onTap: () {},
              ),

              _SettingsTile(
                icon: Icons.shield_outlined,
                title: 'Privacy & Data',
                subtitle: 'Manage your data',
                onTap: () {},
              ),

              _SettingsTile(
                icon: Icons.help_outline_rounded,
                title: 'Help & Support',
                onTap: () {},
              ),

              const Divider(height: AppSpacing.xl),

              // Delete account
              _SettingsTile(
                icon: Icons.delete_forever_rounded,
                title: 'Delete Account',
                titleColor: AppColors.danger,
                onTap: () => _showDeleteDialog(context),
              ),

              // Logout
              _SettingsTile(
                icon: Icons.logout_rounded,
                title: 'Sign Out',
                titleColor: AppColors.danger,
                onTap: () => context.read<AuthBloc>().add(const AuthSignOutRequested()),
              ),

              const SizedBox(height: AppSpacing.xl),

              // App version
              Center(
                child: Text('Yapsy v1.0.0', style: AppTypography.caption.copyWith(color: AppColors.textTertiary)),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete Account?'),
        content: const Text('This will permanently delete your account and all associated data. This action cannot be undone.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              context.read<SettingsCubit>().deleteAccount();
              context.read<AuthBloc>().add(const AuthSignOutRequested());
              Navigator.pop(context);
            },
            child: Text('Delete', style: TextStyle(color: AppColors.danger)),
          ),
        ],
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final Color? titleColor;
  final VoidCallback? onTap;

  const _SettingsTile({required this.icon, required this.title, this.subtitle, this.titleColor, this.onTap});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: titleColor ?? AppColors.textSecondary),
      title: Text(title, style: AppTypography.bodyLarge.copyWith(color: titleColor)),
      subtitle: subtitle != null ? Text(subtitle!, style: AppTypography.caption) : null,
      trailing: const Icon(Icons.chevron_right, color: AppColors.textTertiary),
      contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
      onTap: onTap,
    );
  }
}
